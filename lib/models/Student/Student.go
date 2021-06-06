package Student

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

type Student struct {
	Pk   string `json:"pk"`
	Name string `json:"name"`
}

var STUDENTS_TABLE string

var sess *session.Session
var ddb *dynamodb.DynamoDB

func Init(_sess **session.Session, _ddb **dynamodb.DynamoDB) {
	if *_sess == nil || *_ddb == nil {
		if os.Getenv("PROD") == "PROD" {
			*_sess = session.Must(session.NewSessionWithOptions(session.Options{SharedConfigState: session.SharedConfigEnable}))
			*_ddb = dynamodb.New(*_sess)

		} else if os.Getenv("TEST") == "TEST" {
			*_sess = session.Must(session.NewSessionWithOptions(session.Options{SharedConfigState: session.SharedConfigEnable}))
			*_ddb = dynamodb.New(*_sess, &aws.Config{
				Endpoint:   aws.String("http://localhost:8000"),
				DisableSSL: aws.Bool(true),
			})
		} else if os.Getenv("TEST_IN_DOCKER") == "TEST_IN_DOCKER" {
			*_sess = session.Must(session.NewSessionWithOptions(session.Options{SharedConfigState: session.SharedConfigEnable}))
			*_ddb = dynamodb.New(*_sess, &aws.Config{
				Endpoint:   aws.String("http://" + os.Getenv("DB_HOST") + ":8000"),
				DisableSSL: aws.Bool(true),
			})
		}
	}

	STUDENTS_TABLE = os.Getenv("STUDENTS_TABLE")

	sess = *_sess
	ddb = *_ddb
}

// TODO: add functions
// func CheckGivenPairs(Pair string) (*dynamodb.QueryOutput, error) {
// 	var checkPair *dynamodb.QueryInput = &dynamodb.QueryInput{
// 		TableName:              aws.String(STUDENTS_TABLE),
// 		KeyConditionExpression: aws.String("pk = :partitionKey and sk=:sortKey"),
// 		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
// 			":partitionKey": {
// 				S: aws.String("pair"),
// 			},
// 			":sortKey": {
// 				S: aws.String(Pair),
// 			},
// 		},
// 	}
// 	return ddb.Query(checkPair)
// }
