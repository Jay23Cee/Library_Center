package users

import (
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email    string `bson:"Email,omitempty"`
	Password string `bson:"Password,omitempty"`
	Remember bool   `bson:"Remember"`
}

type authUser struct {
	Email        string `bson:"Email,omitempty"`
	PasswordHash string `bson:"Password,omitempty"`
}

var authUserDB = map[string]authUser{} // email => authUser{email,hash}

type UserService struct {
}

func (UserService) createUser(newUser User) error {
	_, ok := authUserDB[newUser.Email]
	if !ok {
		return errors.New("User already exist")
	}
	passwordHash, err := HashPassword(newUser.Password)
	if err != nil {
		return err
	}
	newAuthUser := authUser{
		Email:        newUser.Email,
		PasswordHash: passwordHash,
	}
	authUserDB[newAuthUser.Email] = newAuthUser
	return nil
}

func HashPassword(password string) (string, error) {
	hashedpassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedpassword), nil
}

var DefaultUserService userService

type userService struct {
}
