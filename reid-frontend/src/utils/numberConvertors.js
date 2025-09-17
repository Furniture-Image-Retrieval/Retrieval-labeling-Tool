export const englishToPersianNumber = number => number.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])

export const persianToEnglishNumber = number => number.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
