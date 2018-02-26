# YelpCamp

* Add Landing page
* Add Campgrounds Page that lists all Campgrounds

Each Campground has:

* Name
* Image
* Description
* Comments (referenced by id)

Each Comment has:

* Author
* Text

## RESTful routes in use:

| Name     | URL     | Verb     | Desc.     |
| -------- | ------- |:--------:| --------- |
| INDEX    | /campgrounds | GET | Display all the campgrounds |
| NEW      | /campgrounds/new | GET | Display form to make a new campground |
| CREATE   | /campgrounds | POST | Add a new campground to the DB |
| SHOW     | /campgrounds/:id | GET | Shows one campground in detail |
|     |     |     |     |
| NEW      | /campgrounds/:id/comments/new | GET | Display form to add a new comments |
| CREATE   | /campgrounds/:id/comments | POST | Adds a new comment to the campground in the DB |

## To run locally

`nodemon -e js,ejs,css app.js`