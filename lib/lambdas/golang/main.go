package main

import (
	"context"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/husseinhammoud/cdktesting-backend/lib/models/API_Responses"
	"github.com/husseinhammoud/cdktesting-backend/lib/models/Address"
)

type Event struct {
	Sub string `json:"sub"`
}

var sess *session.Session
var ddb *dynamodb.DynamoDB

func HandleLambdaFunction(ctx context.Context, request Event) (API_Responses.Response, error) {
	if sess == nil || ddb == nil {
		Address.Init(&sess, &ddb)
	}

	// TODO: crud

}

func main() {
	lambda.Start(HandleLambdaFunction)
}
