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

# Version History

### v2.5.1
Feb-14, 2021
* extract footer and header into v-once components
* make each URL a clickable link

### v2.5.0
Feb-14, 2021
* remove row highlights from the previous version -- too distracting
* extract "redirected" out of the status - into a separate info (light blue) badge
* record speed/time

### v2.4.1
Feb-13, 2021
* add row highlights

### v2.4.0
Feb-13, 2021
* add button and spinner for each row

### v2.3.1
Feb-12, 2021
* update header looks
* add github link
* hide env for prod

### v2.3.0
Feb-12, 2021
* add footer
* hide sum badge if number is 0
* check for redirects (301 or 302)

### v2.2.0
Feb-12, 2021
* speed up fetch by fetching headers only (no content). Replaced the GET method with HEAD in the server proxy. Need to confirm whether it actually improved anything?
* add summary count numbers

### v2.1.0
Feb-12, 2021
* highlight 200 as green, error code (404, 500) as red, anything else as yellow.

### v2.0.0
Feb-11, 2021
* Added bootstrap

### v1.1.0
Feb-11, 2021
* Added ability to edit the list of URLs.

### v1.0.0
Feb-10, 2021
* Init version with a static list.
