---
scripts:
  - examples/css-styleguide.js
stylesheets:
  - examples/css-styleguide.scss
---

# CSS Styleguide

Styled tables can be created by adding the `table` and `styled` classes
together like such:

```html
<table id="example-styled-table" class='table styled'>
  <tbody>
    <tr>
      <td>Row One Cell One</td>
      <td>Row One Cell Two</td>
    </tr>
  </tbody>
</table>
```

Here is the SCSS style code which implements this.

```scss
.table.styled {
  color: pink;
}
```

Here is some functionality

```javascript
var table = document.getElementById('example-styled-table')

table.addEventListener('click', function(){ 
  alert('table clicked')
})
```

These things can be rendered on the page in such a way that you could do
interesting things, such as recreate js fiddle or codepen style tools
