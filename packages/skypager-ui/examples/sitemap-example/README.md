# Sitemap Example

In this example I will show how you could generate a complex web application from text file organized as a kind of sitemap.  Sitemaps are a common tool for UX Designers, Information Architects, and Content Strategists.  Software like Axure will produce them.  

Ideally a sitemap could be generated from these software tools and we could parse it.  In this example, we will write it by hand.

## Concepts

A **Sitemap** is a way of describing a website's general URL structure in a way that allowing a site's visitor to find every possible page that is available to them.

A **Route** is a dynamic URL pattern that lets us use parts of the URL as identifiers in that we can use to find the content a user expects to see and display it on the page.  Almost all modern web applications have this concept even if they use a different name for it.

A **Skypager Application** understands routes and assigns a Screen responsible for displaying the content.  

A **Screen** has a **Layout** that is made up of different **Components**.  These are used to display the content in our UI.  It could be as simple as displaying the content as HTML to be read, along side some navigation.  It could also be much more advanced

** Note about SEO sitemaps and web crawlers **

Most website crawlers can find pages on your website using a brute force method of following every link.  An XML Sitemap is a more elegant way of providing website crawlers with a list of all of the links to follow.  Skypager can easily generate this for you.  This is not what we are going to write in this exercise.

## Getting Started

Since in Skypager we strongly prefer simple text formats which are easy to both read and write, we are going to be using a combination of YAML and Markdown to build our sitemap.

A Website with a lot of dynamic pages would not be something we would want to type out manually, so we will need some sort of way of writing our URLs to indicate that they are dynamic and dependent on some underlying data source such as a database or spreadsheet.

Markdown heading structures and lists combined with link syntax will be our goto solution as usual.

## Example Sitemap

```markdown
# Skypager.io Website

## Home

## Documentation
```
