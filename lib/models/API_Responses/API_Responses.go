package API_Responses

type Response struct {
	StatusCode int                    `json:"statusCode"`
	Message    string                 `json:"message"`
	Data       map[string]interface{} `json:"data"`
}

func DefineResponse(statusCode int, message string, data map[string]interface{}) Response {
	return Response{
		StatusCode: statusCode,
		Message:    message,
		Data:       data,
	}
}

func R_200(message string, data map[string]interface{}) Response {
	return DefineResponse(200, message, data)
}
func R_204(message string, data map[string]interface{}) Response {
	return DefineResponse(204, message, data)
}

func R_400(message string, data map[string]interface{}) Response {
	return DefineResponse(400, message, data)
}
func R_404(message string, data map[string]interface{}) Response {
	return DefineResponse(404, message, data)
}
