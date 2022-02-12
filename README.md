# CR DIMA TEST

Ping a list of URLs to ensure they are alive.

![example](docs/sample.png)

https://cr-dima-test.herokuapp.com/

## Local Dev

```
npm install
npm run dev
```

http://localhost:3000/

## TODO

1. extract each row item into a separate vue class
   * do the same for edit/display views
2. migrate to vue3
   * setup(), better reactivity (no need to Vue.set)
3. confirm that jquery is necessary dependency
   * for bootstrap?
   * do bundle analysis
4. clean up package.json scripts (way too many!)
5. write at least one meaningful test
6. confirm that webpack is v5 but cli is only v4
7. Finally, migrate away from heroku on a dedicated server
   * reconsider express as the server side
   * reconsider devDependencies thus
   * look into server-side rendering optimization
8. check out yarn as an alternative for npm (meh)
9. Check all npm outdated packages, upgrade.
10. Update each link timer to show seconds (like the total already does).
