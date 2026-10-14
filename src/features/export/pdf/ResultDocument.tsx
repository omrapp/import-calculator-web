import {
  Defs,
  Document,
  G,
  LinearGradient,
  Page,
  Path,
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';

import { FONT_STACK } from './fonts';
import type { PdfModel } from './model';

/** Brand colours, matching public/favicon.svg. Body text stays black on white. */
const NAVY = '#193365';
const TEAL = '#25a4b1';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: FONT_STACK,
    fontSize: 10,
    color: '#111827',
  },
  brandBar: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    marginBottom: 14,
    borderBottom: `2pt solid ${NAVY}`,
  },
  brandName: { fontSize: 12, fontWeight: 700, color: NAVY },
  title: { fontSize: 18, fontWeight: 700 },
  muted: { color: '#6b7280', fontSize: 9 },
  summary: { flexWrap: 'wrap', gap: 8, marginVertical: 14 },
  card: {
    border: '1pt solid #d1d5db',
    borderRadius: 4,
    padding: 8,
    width: '31%',
  },
  primaryCard: { backgroundColor: NAVY, color: '#ffffff' },
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

/** The ship badge from the favicon, drawn as vectors. */
function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={NAVY} />
          <Stop offset="1" stopColor={TEAL} />
        </LinearGradient>
      </Defs>
      <Rect width="32" height="32" rx="8" fill="url(#brand)" />
      <G
        transform="translate(6 6) scale(0.8333)"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M12 2v2" />
        <Path d="M12 9.189V13" />
        <Path d="M19 12V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6" />
        <Path d="M19.38 19A11.6 11.6 0 0021 13l-8.188-3.639a2 2 0 00-1.624 0L3 13.001a11.6 11.6 0 002.81 7.76" />
        <Path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </G>
    </Svg>
  );
}

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
        <View style={[styles.brandBar, line]}>
          <LogoMark />
          <Text style={[styles.brandName, text]}>{model.brand}</Text>
        </View>
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
