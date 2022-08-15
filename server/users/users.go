package users

type SignupRequest struct {
	Name     string `bson:"Name,omitempty"`
	Email    string `bson:"Email,omitempty"`
	Password string `bson:"Password,omitempty"`
}


type Userlogin struct {
	Email    string `bson:"Email,omitempty"`
	Password string `json:"-" bson:"Password"`
	Remember bool   `bson:"Remember"`
	ID       string `json:"_id,omitempty" bson:"_id,omitempty"`
}

type Users struct {
	Email    string `bson:"Email,omitempty"`
	Password string `json:"Password" bson:"Password"`
	Remember bool   `bson:"Remember"`
	ID       string `json:"_id,omitempty" bson:"_id,omitempty"`
}

type authUser struct {
	Email        string `bson:"Email,omitempty"`
	PasswordHash string `bson:"Password,omitempty"`
}




