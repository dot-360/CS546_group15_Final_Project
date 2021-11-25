const mainRoutes = require('./searching');

const constructorMethod = (app) => {
    app.use('/',mainRoutes)
    /*app.get("/", (req,res) => {
        let title = "People Finder"
        res.render("posts/searching", { title } )

    })*/

  app.use('*', (req, res) => {
    res.status(404).render('posts/error', { "status": 404, "message": "Page Cannot Be Found" })
  });
};

module.exports = constructorMethod;