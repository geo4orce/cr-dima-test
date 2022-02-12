# CR DIMA TEST

Ping a list of URLs to ensure they are alive.

![example](docs/sample.png)

http://cr-dima-test.herokuapp.com/

# TODO

1. extract each row item into a separate vue class
   * do the same for edit/display views
1. migrate to vue3
   * setup(), better reactivity (no need to Vue.set)
1. confirm that jquery is necessary dependency
   * for bootstrap?
   * do bundle analysis
1. clean up package.json scripts (way too many!)
1. write at least one meaningful test
1. confirm that webpack is v5 but cli is only v4
1. Finally migrate away from heroku on a dedicated server
   * reconsider express as the server side
   * reconsider devDependencies thus
   * look into server-side rendering optimization
1. check out yarn as an alternative for npm
