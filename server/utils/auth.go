package utils

import "errors"

func CheckAuth(role string, rtype string) (err error) {
	err = nil

	if rtype != role {
		err = errors.New("Unathorized Login")
		return err
	}
	return err
}
