export class ApiResponse {
  static success(message, code, data = null, count = null) {
    return {
      status: code,
      success: true,
      message: message,
      ...(count >= 0 && count != null && { count }),
      ...(data && { data }),
    };
  }
}
