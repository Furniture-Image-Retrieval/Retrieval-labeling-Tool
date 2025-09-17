const errorTable = {
  WRONG_CREDENTIALS: 'نام کاربری یا رمز عبور اشتباه است!',
  CONTACT_ADMIN: 'مشکل داخلی! با ادمین تماس بگیرید!',
}

export default function errorMessageToText (message) {
  return errorTable[message] || 'خطای عمومی!'
}
