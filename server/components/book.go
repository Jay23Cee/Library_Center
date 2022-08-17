package components

type Book struct {
	Title     string `bson:"Title,omitempty"`
	Author    string `bson:"Author,omitempty"`
	Publisher string `bson:"Publisher,omitempty"`
	Year      string `bson:"Year, omitempty"`

	ID string `json:"ID,omitempty" bson:"_id,omitempty"`

	// CreatedAt time.Time
	// UpdatedAt time.Time
	// DeletedAt gorm.DeletedAt `gorm:"index"`
}
