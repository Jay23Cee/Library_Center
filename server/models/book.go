package models

type Book struct {
	Title     string `bson:"Title,omitempty"`
	Author    string `bson:"Author,omitempty"`
	Publisher string `bson:"Publisher,omitempty"`
	Year      string `bson:"Year, omitempty"`
	Img       string `bson:"Img, omitempty"`
	Img_url   string `bson:"Img_url, omitempty"`
	ID        string `json:"ID,omitempty" bson:"_id,omitempty"`

	// CreatedAt time.Time
	// UpdatedAt time.Time
	// DeletedAt gorm.DeletedAt `gorm:"index"`
}
