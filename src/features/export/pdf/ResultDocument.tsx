import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { FONT_STACK } from './fonts';
import type { PdfModel } from './model';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: FONT_STACK,
    fontSize: 10,
    color: '#111827',
  },
  title: { fontSize: 18, fontWeight: 700 },
  muted: { color: '#6b7280', fontSize: 9 },
  summary: { flexWrap: 'wrap', gap: 8, marginVertical: 14 },
  card: {
    border: '1pt solid #d1d5db',
    borderRadius: 4,
    padding: 8,
    width: '31%',
  },
  primaryCard: { backgroundColor: '#111827', color: '#ffffff' },
  cardValue: { fontSize: 12, fontWeight: 700, marginTop: 2 },
  section: {
    border: '1pt solid #d1d5db',
    borderRadius: 4,
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: '#f3f4f6',
    padding: 6,
    fontWeight: 700,
  },
  row: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderTop: '0.5pt solid #e5e7eb',
  },
  rowLine: { justifyContent: 'space-between', gap: 12 },
  subtotal: { backgroundColor: '#f9fafb', fontWeight: 700 },
  total: { backgroundColor: '#e5e7eb', fontWeight: 700 },
  formula: { color: '#6b7280', fontSize: 8, fontWeight: 400, marginTop: 1 },
  footer: { marginTop: 12, color: '#6b7280', fontSize: 8 },
});

/**
 * Intl adds RLM/ALM marks to he/ar numbers; in a PDF they flip whole formulas
 * right-to-left. Without them, figures read left-to-right as on screen.
 */
const plain = (figure: string) => figure.replace(/[\u200e\u200f\u061c]/g, '');

export function ResultDocument({ model }: { model: PdfModel }) {
  const rtl = model.dir === 'rtl';
  // Rows run from the inline-start edge; numbers and formulas stay LTR.
  const line = { flexDirection: rtl ? 'row-reverse' : 'row' } as const;
  const align = { textAlign: rtl ? 'right' : 'left' } as const;
  const text = { ...align, direction: model.dir };
  // Money, factors and formulas read left-to-right in every language.
  const figure = { ...align, direction: 'ltr' } as const;

  return (
    <Document title={model.title} language={model.language}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={[styles.title, text]}>{model.title}</Text>
          <Text style={text}>{model.subtitle}</Text>
          <Text style={[styles.muted, text]}>{model.ratesNote}</Text>
          <Text style={[styles.muted, text]}>{model.createdOn}</Text>
        </View>

        <View style={[styles.summary, line]}>
          {model.summary.map(card => (
            <View
              key={card.label}
              style={[styles.card, card.primary ? styles.primaryCard : {}]}
            >
              <Text style={text}>{card.label}</Text>
              <Text style={[styles.cardValue, figure]}>
                {plain(card.value)}
              </Text>
            </View>
          ))}
        </View>

        {model.sections.map(section => (
          <View key={section.title} style={styles.section} wrap={false}>
            <Text style={[styles.sectionTitle, text]}>{section.title}</Text>
            {section.rows.map((row, i) => (
              <View
                key={i}
                style={[styles.row, row.emphasis ? styles[row.emphasis] : {}]}
              >
                <View style={[styles.rowLine, line]}>
                  <Text style={text}>{row.label}</Text>
                  <Text style={{ direction: 'ltr' }}>{plain(row.value)}</Text>
                </View>
                {row.formula && (
                  <Text style={[styles.formula, figure]}>
                    {plain(row.formula)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}

        <Text style={[styles.footer, text]}>{model.footer}</Text>
      </Page>
    </Document>
  );
}
