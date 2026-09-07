const sessionKeys = [
  "token",
  "FARMER_JWT",
  "OPERATOR_JWT",
  "JWT_TOKEN",
  "userRole",
  "userMobile",
  "userId",
  "userName",
  "operatorCode",
  "FARMER_BOOKING_ID",
];

export function clearSession() {
  sessionKeys.forEach((key) => localStorage.removeItem(key));
}
