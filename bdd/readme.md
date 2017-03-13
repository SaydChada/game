**To import database**

replace <absolute_path> by path to file

_Collection comments_

``
mongoimport --db blog --collection comments --file <absolute_path>/comments.json --jsonArray
``

_Collection users_

``
mongoimport --db blog --collection comments --file <absolute_path>/users.json --jsonArray
``

_Collection posts_

``
mongoimport --db blog --collection comments --file <absolute_path>/posts.json --jsonArray
``