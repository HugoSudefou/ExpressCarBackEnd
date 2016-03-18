doctype html
html(lang='en')
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge')
    meta(name='viewport', content='width=device-width, initial-scale=1')
    // The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags
    meta(name='description', content='')
    meta(name='author', content='')
    link(rel='icon', href='../../favicon.ico')
    title CARea
    // Bootstrap core CSS
    link(href='../Stylesheets/bootstrap/bootstrap.css', rel='stylesheet')
    script(src='https://code.jquery.com/jquery-1.11.3.min.js')
    script(src='Js/bootstrap.js')
    // jQuery (necessary for Bootstrap's JavaScript plugins)
    script(src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js')
    // Include all compiled plugins (below), or include individual files as needed
    // Latest compiled and minified JavaScript
    script(src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js')
    // Custom styles for this template
    link(href='../Stylesheets/Style.css', rel='stylesheet')
  //
    NAVBAR
    ==================================================
  body
    .navbar-wrapper
      .container
        nav.navbar.navbar-inverse.navbar-static-top
          .container
            .navbar-header
              button.navbar-toggle.collapsed(type='button', data-toggle='collapse', data-target='#navbar', aria-expanded='false', aria-controls='navbar')
                span.sr-only Toggle navigation
                span.icon-bar
                span.icon-bar
                span.icon-bar
              a.navbar-brand(href='../index.html') CARea
            #navbar.navbar-collapse.collapse
              ul.nav.navbar-nav
                li
                  a(href='index_about.html') A propos / About
              ul.nav.navbar-nav.navbar-right
                li
                  a(href='index_signup.html')
                    span.glyphicon.glyphicon-user
                    |  S'inscrire / Sign up
                li.active
                  a(href='index_signin.html')
                    span.glyphicon.glyphicon-log-in
                    |  Se connecter / Sign in
    .container-fluid
      .row
        .main
          .col-md-offset-4.col-md-4
            div(style='text-align:center')
              p
              h1 Sign in
              p
            br
            br
            form.form-horizontal(action='/users/login', name='login', role='form', method='post', accept-charset='utf-8', style='text-align:center')
              input(type='hidden', name='_csrf', value='csrf')
              .form-group
                .col-md-15
                  input#UserUsername.form-control(name='username', placeholder='Login', type='text', style='text-align:center')
              .form-group
                .col-md-15
                  input#UserPassword.form-control(name='password', placeholder='Password', type='password', style='text-align:center')
              br
              .form-group
                .col-md-15
                  input.btn.btn-success.btn-fat(type='submit', value='Connect')
    br
    br
    br
    br
    br
    br
    .footer-p
      footer#footer.site-footer
        section.site-footer-bottom
          ul.display
            li
              ul
                li.dispi
                  | ©2016 CARea
                  a  
                li.dispi
                  a(href='#') Legal Notice
                  a  
                li.dispi
                  a(href='index_faq.html') FAQ
