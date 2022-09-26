# Library_Center
This is a library's web-based, RESTful API. Admin may currently generate new, read, change, and delete stored data. Data is stored using mongodb. The frontend development uses Ant design, Typescript, and React. This application can act as a RESTful API because its backend is written in Golang using chi as middleware.

9/24/22
Private Table. Delete is not working.
Private Table Edit > Cancel not working
Add Img to booktable. 
ADD CATEGORY TO BOOK
Make sure only  one Image is uploaded. 

9/23/22 : REMOVE Comment from Access validation on addbook. bookhandler.go


9/14/22
Need to add image to mongodb.

add image to the table.
Or Maybe Remove the tables. and add images and boxes for each book.







9/6/2022
PUSHING TO PRODUCTION:
Comment all the //devops
and the getdotenv..

9/1/2022:
Need Test for All of User Routes and Book Routes.
    Need to find a way to get Cookies inserted in the test area. 

+ Add a Homepage for both users. (College maybe?)
+ Add a Get All Admins + All Users list. (Teacher, Students?)


8/26/2022
BOOKTABLE: an Approach for USER and ADMIN action column can be to check which user I currently have 
in order to make a column. 
ONE column for ADMIN another just for USER.
Instead of creating an entire page for the table to beview.
Depending on the user Role the person would be able to see the ACTION  bar.

8/24/2022:
We need to adjust the same thing to PRIVATE as we did for USER.
the Private login to send back the NECESSARY data only.


8/22/2022:
Golang : R (refresh_token) needs a way to get revoked during logout.


8/21/2022:
Private Route (go) for Owner and Manager.
Owner: 500
Manager: 800
Create manager form.

Permission.

Only admin can change admin
..

frontside needs to add FIRST NAME , LAST NAME, PHONE, 

8/12/2022: 
Todo:
Adjust password hash before sending to goserver.

validate url link.

organize GOLANG routers, controllers, models folder




