export const numberFormat = {
    default: new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }),
    percent: new Intl.NumberFormat(undefined, {
        style: "percent",
        maximumFractionDigits: 3,
    }),
    second: new Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "second",
        unitDisplay: "long",
        maximumFractionDigits: 3,
    }),
};