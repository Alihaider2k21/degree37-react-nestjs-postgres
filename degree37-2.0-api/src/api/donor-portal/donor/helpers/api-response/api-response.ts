export class ApiResponse {
  static success(message, code, data = null) {
    delete data.password;
    return {
      status: code,
      success: true,
      message: message,
      data: data,
    };
  }
}
