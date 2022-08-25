package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SignupRequest struct {
	Name     string `bson:"Name,omitempty"`
	Email    string `bson:"Email,omitempty"`
	Password string `bson:"Password,omitempty"`
	Role     string `bson:"Role"`
}

type Userlogin struct {
	Email    string `bson:"Email,omitempty"`
	Password string `json:"-" bson:"Password"`
	Remember bool   `bson:"Remember"`
	ID       string `json:"-" bson:"_id,omitempty"`
}

type Users struct {
	ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	First_name    *string            `json:"First_name" bson:"First_name" validate:"require,min=2,max=100"`
	Last_name     *string            `json:"Last_name" bson:"Last_name" validate:"require,min=2,max=100"`
	Password      *string            `json:"Password" bson:"Password" validate:"required,mind=6"`
	Email         *string            `json:"Email" bson:"Email,omitempty" validate:"email, required"`
	Phone         *string            `json:"Phone" bson:"Phone" validate:"required"`
	Token         *string            `json:"Token" bson:"Token"`
	User_type     *string            `json:"User_type" bson:"User_type" validate:"required, eq=ADMIN|eq=USER"`
	Refresh_token *string            `json:"Refresh_token" bson:"Refresh_token""`
	Created_at    time.Time          `json:"Created_at" bson:"Created_at" `
	Updated_at    time.Time          `json:"Updated_at" bson:"Updated_at"`
	User_id       string             `json:"User_id" bson:"User_id"`
}
type User struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	First_name *string            `json:"First_name" bson:"First_name" validate:"require,min=2,max=100"`
	Last_name  *string            `json:"Last_name" bson:"Last_name" validate:"require,min=2,max=100"`
	Email      *string            `json:"Email" bson:"Email,omitempty" validate:"email, required"`
	Phone      *string            `json:"Phone" bson:"Phone" validate:"required"`
	User_type  *string            `json:"User_type" bson:"User_type" validate:"required, eq=ADMIN|eq=USER"`
	User_id    string             `json:"User_id" bson:"User_id"`
}

type authUser struct {
	Email        string `bson:"Email,omitempty"`
	PasswordHash string `bson:"Password,omitempty"`
}
