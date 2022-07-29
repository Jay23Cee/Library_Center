# Library_Center
This is a library's web-based, RESTful API. Admin may currently generate new, read, change, and delete stored data. Data is stored using mongodb. The frontend development uses Ant design, Typescript, and React. This application can act as a RESTful API because its backend is written in Golang using chi as middleware.

7/26/2022: Error found on DOCKER. 
            the CACHE for the frontend remains in the browser.
                when the backend gets run it picks up the front end due to the CACHE.
                It is not loading the front end from the docker. 
                    -This needs to be fix. 