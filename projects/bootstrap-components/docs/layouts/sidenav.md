# Sidenav Layout

Display as fixed container with side navigation on the left, and content on the right.

```html
  <div class="container">
    <div class="row">
      <div class="col-sm-3 sidebar">
        <nav class="sidebar-nav">
          <div class="sidebar-header">
            <button class="nav-toggler nav-toggler-sm sidebar-toggler" type="button" data-toggle="collapse" data-target="#nav-toggleable-sm">
              <span class="sr-only">Toggle nav</span>
            </button>
            <a class="sidebar-brand img-responsive" href="../index.html">
              <span class="icon icon-leaf sidebar-brand-icon"></span>
            </a>
          </div>

          <div class="collapse nav-toggleable-sm" id="nav-toggleable-sm">
            <form class="sidebar-form">
              <input class="form-control" type="text" placeholder="Search...">
              <button type="submit" class="btn-link">
                <span class="icon icon-magnifying-glass"></span>
              </button>
            </form>
            <ul class="nav nav-pills nav-stacked">
              <li class="nav-header">Dashboards</li>
              <li >
                <a href="../index.html">Overview</a>
              </li>
              <li class="active">
                <a href="../order-history/index.html">Order history</a>
              </li>
              <li >
                <a href="../fluid/index.html">Fluid layout</a>
              </li>
              <li >
                <a href="../icon-nav/index.html">Icon nav</a>
              </li>

              <li class="nav-header">More</li>
              <li >
                <a href="../docs/index.html">
                  Toolkit docs
                </a>
              </li>
              <li>
                <a href="http://getbootstrap.com" target="blank">
                  Bootstrap docs
                </a>
              </li>
              <li >
                <a href="../light/index.html">Light UI</a>
              </li>
              <li>
                <a href="#docsModal" data-toggle="modal">
                  Example modal
                </a>
              </li>
            </ul>
            <hr class="visible-xs m-t">
          </div>
        </nav>
      </div>
      <div class="col-sm-9 content">
        <div class="dashhead">
  <div class="dashhead-titles">
    <h6 class="dashhead-subtitle">Dashboards</h6>
    <h2 class="dashhead-title">Order history</h2>
  </div>

  <div class="btn-toolbar dashhead-toolbar">
    <div class="btn-toolbar-item input-with-icon">
      <input type="text" value="01/01/15 - 01/08/15" class="form-control" data-provide="datepicker">
      <span class="icon icon-calendar"></span>
    </div>
  </div>
</div>

<div class="flextable table-actions">
  <div class="flextable-item flextable-primary">
    <div class="btn-toolbar-item input-with-icon">
      <input type="text" class="form-control input-block" placeholder="Search orders">
      <span class="icon icon-magnifying-glass"></span>
    </div>
  </div>
  <div class="flextable-item">
    <div class="btn-group">
      <button type="button" class="btn btn-primary-outline">
        <span class="icon icon-pencil"></span>
      </button>
      <button type="button" class="btn btn-primary-outline">
        <span class="icon icon-erase"></span>
      </button>
    </div>
  </div>
</div>

<div class="table-full">
  <div class="table-responsive">
    <table class="table" data-sort="table">
      <thead>
        <tr>
          <th><input type="checkbox" class="select-all" id="selectAll"></th>
          <th>Order</th>
          <th>Customer name</th>
          <th>Description</th>
          <th>Date</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10001</a></td>
          <td>First Last</td>
          <td>Admin theme, marketing theme</td>
          <td>01/01/2015</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10002</a></td>
          <td>Firstname Lastname</td>
          <td>Admin theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10003</a></td>
          <td>Name Another</td>
          <td>Personal blog theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10004</a></td>
          <td>One More</td>
          <td>Marketing theme, personal blog theme, admin theme</td>
          <td>01/01/2015</td>
          <td>$300.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10005</a></td>
          <td>Name Right Here</td>
          <td>Personal blog theme, admin theme</td>
          <td>01/02/2015</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10006</a></td>
          <td>First Last</td>
          <td>Admin theme, marketing theme</td>
          <td>01/01/2015</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10007</a></td>
          <td>Firstname Lastname</td>
          <td>Admin theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10008</a></td>
          <td>Name Another</td>
          <td>Personal blog theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10009</a></td>
          <td>One More</td>
          <td>Marketing theme, personal blog theme, admin theme</td>
          <td>01/01/2015</td>
          <td>$300.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10010</a></td>
          <td>Name Right Here</td>
          <td>Personal blog theme, admin theme</td>
          <td>01/02/2015</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10011</a></td>
          <td>First Last</td>
          <td>Admin theme, marketing theme</td>
          <td>01/01/2015</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10012</a></td>
          <td>Firstname Lastname</td>
          <td>Admin theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10013</a></td>
          <td>Name Another</td>
          <td>Personal blog theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10014</a></td>
          <td>One More</td>
          <td>Marketing theme, personal blog theme, admin theme</td>
          <td>01/01/2015</td>
          <td>$300.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10015</a></td>
          <td>Name Right Here</td>
          <td>Personal blog theme, admin theme</td>
          <td>01/02/2015</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10016</a></td>
          <td>First Last</td>
          <td>Admin theme, marketing theme</td>
          <td>01/01/2015</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10017</a></td>
          <td>Firstname Lastname</td>
          <td>Admin theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10018</a></td>
          <td>Name Another</td>
          <td>Personal blog theme</td>
          <td>01/01/2015</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10019</a></td>
          <td>One More</td>
          <td>Marketing theme, personal blog theme, admin theme</td>
          <td>01/01/2015</td>
          <td>$300.00</td>
        </tr>
        <tr>
          <td><input type="checkbox" class="select-row"></td>
          <td><a href="#">#10020</a></td>
          <td>Name Right Here</td>
          <td>Personal blog theme, admin theme</td>
          <td>01/02/2015</td>
          <td>$200.00</td>
      </tbody>
    </table>
  </div>
</div>

<div class="text-center">
  <ul class="pagination">
    <li>
      <a href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="active"><a href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">4</a></li>
    <li><a href="#">5</a></li>
    <li>
      <a href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</div>

      </div>
    </div>
  </div>
```
