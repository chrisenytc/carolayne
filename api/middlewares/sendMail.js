'use strict';

/*
 * Module Dependencies
 */

var nodemailer = require('nodemailer');

module.exports = {

    /*
     * Set true if you want enable this middleware
     */

    enabled: true,
    fn: function(req, res, next) {
        //Create mailer
        var Mailer = nodemailer.createTransport('SMTP', {
            service: 'Gmail',
            auth: {
                user: req.configs.mail.email,
                pass: req.configs.mail.password
            }
        });
        res.sendMail = function(subject, email, templatePath, data) {
            // Adding app_url
            data = data || {};
            data.appUrl = req.configs.app.url;
            return res.render(templatePath, data, function(err, html) {
                if (err) {
                    return next(err);
                }
                var mailOptions = {
                    from: req.configs.mail.from,
                    to: email,
                    subject: subject,
                    html: html
                };
                Mailer.sendMail(mailOptions, function(err) {
                    if (err) {
                        return next(err);
                    }
                });
            });
        };
        //Next request
        next();
    }
};
