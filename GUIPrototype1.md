# Graphical User Interface Prototype  

Authors: 
* Alessio Carachino
* Samuele Giangreco
* Daniel Guarecuco
* Zoltan Mazzuco

Deadline: 13 april 2022

Version: #1


# Screenshots

## Case 1 - Log-in

### Regular Log-in
![ManagerLogin](GUIimages/Login.png)

This is the view presented to all users trying to use the application. If any user tries to connect to any other page without being authenticated, they will be redirected here for login.

* The user is requested to provide e-mail and password.
* The ***Login*** button sends the form for authentication with the backend.
  * If it is the first time the user tries to log in, they will be redirected to the [Firt-time log-in](#firt-time-log-in) screen.
  * Otherwise, they will be redirected to the [Dashboard](#case-2-dashboard) screen.

### Firt-time Log-in

![ManagerLogin](GUIimages/Firstlogin.png)

This view is presented to all users that are trying to access the application for the first time after the administrator has created their accounts. They are requested to change their default password. Failure to change the password will reject the authentication.
* By pressing ***Submit*** the user is redirected to the [Dashboard](#case-2-dashboard) screen.
* If the passwords are not the same, an error message is displayed and the user can try again.


## Case 2 - Dashboard
![MainMenu](GUIimages/Mainmenu.png)

The main menu of the application allows to 
* [Manage items](#case-3-manage-items)
* [Manage users](#manage-users)
* [Manage orders](#case-5-manage-orders)
* [Manage suppliers](#manage-supplier)
* [Quality check](#case-7-quality-check)
* [Show warehouse](#case-8-show-warehouse)


## Case 3 - Manage items
![ManageItems](GUIimages/ManageItems.png)

This view shows the available items in the warehouse and their information:
* ID: is a unique identifier for an item sold by a specific Company
* Category
* Product/Item
* Name/Company: is the supplier that sells the item
* Min Amount: shows the minimum amount of that item that must always be available, it shows the sum of the item from all suppliers
* Amount: shows the amount of that item that is available in the warehouse
* Price: is the price at which the supplier sells the item
* Shelf: is the physical position of the item in the warehouse

* Options:
  * By pressing ***Edit*** the user is redirected to the [Edit Items](#edit-items) screen.

Items can be filtered by category, item or company or a more specific search could be done with the search bar on the top right. 
Changing the granularity of the view means that some tabs will not be shown, for example the price when grouping by items.

### Edit items
![EditItems](GUIimages/EditItem.png)
For each product it is possible to modify the quantity, the price and its position.
Changes can be confirmed or aborted.


## Case 4 - Manage users

### Manage users
![Manageuser](GUIimages/ManageUsers.png)
In this page the administrator is able to see several information about employees and suppliers, it can be filtered by role or searched by different attributes.

A new user can be added by pressing ***Add user*** where a [New Employee](#new-employee) or a [New Supplier](#new-supplier) can be added.

It is also possible to [Edit a user](#edit-user) by selecting ***Edit*** or removing one with ***Remove***.

### New employee
![NewUserEmployee](GUIimages/CreateUser_OU_Manager.png)
This section allows the administrator to register a new employee of the organization. It takes as inputs:
* Role: Manager/Quality Supervisor/OU
* Name and Surname
* E-mail
The ***Create*** button register a new user, and then redirects to [Manage users](#manage-users).

### New supplier
![NewUserSupplier](GUIimages/CreateUser_Supplier.png)
This section allows the administrator to register a new supplier of the organization. It takes as inputs:
* Role: Supplier
* Name and Surname
* E-mail
The ***Create*** button register a new supplier, and then redirects to [Manage users](#manage-users).

### Edit user
![EditEmployee](GUIimages/EditUser_OU_Manager.png)
This section allows the administrator to modify the information of an user. It also allows to delete an user from the system.
The ***Save*** button modifies the user's information, and then redirects to [Manage users](#manage-users).
The ***Go back*** button redirects to [Manage users](#manage-users).
The ***Bin*** icon deletes the user and then redirects to [Manage users](#manage-users).


## Case 5 - Manage orders

### List orders to suppliers
![OrderSupplier](GUIimages/ManageOrders_suppliers.png)
This screen shows the list of all olders to suppliers. By changing the drop-down menu on the left to ***Internal Orders*** it is possible to switch to the [Internal Orders](#list-internal-orders). The view can be grouped by item and/or supplier, and a search can be done by specific fields.

By selecting ***Details*** the [Order details](#order-details) are shown, or  ***Delete*** to remove the order, only if it is in pending state

### Order details
![OrderDetails](GUIimages/OrderDetails_Suppliers.png)
Here the order details are listed. Regarding the orders to suppliers, the price per unit and the total price are shown. The ***Recepit*** button downloads this report. It is also possible to cancel an order, if it hasn't been shipped, by using the ***Cancel Order*** button. It is also possible to issue the same order again with ***Order Again***.

### List internal orders
![OrderInternal](GUIimages/ManageOrders_internal.png)
This screen lists all internal orders. By changing the drop-down menu on the left to ***Orders to Suppliers*** it is possible to switch to the [Orders to suppliers](#list-orders-to-suppliers). The view can be grouped by item and/or Organizational unit that is performing the order, and a search by a specific field can be done.

### Placing Internal Orders
![PlacingOrder](GUIimages/InternalOrder.png)
An internal order can be placed by selecting the quantities of each item and proceeding to ***Order*** to be redirected to the [order confirmation](#internal-orders-confirmation) page, it is also possible to ***Go back*** aborting the order and returning to the previous page.

### Internal Orders Confirmation
![OrderConfirmation](GUIimages/InternalOrderconfirmation.png)
Confirmation page for a new Internal order. It is possible to cancel an order not already processed.

### Placing orders to suppliers
![IssueOrder](GUIimages/IssueOrder.png)
This section shows the information on the products that are being purchased from a supplier.
It is possible to modify the quantity of an item, adding more products from the same supplier. The order can be ***Aborted*** or ***Confirmed***.


## Case 6 - Manage suppliers
### Manage supplier
![ManageSupplier](GUIimages/ManageSuppliers.png)
For each Supplier it is possible to [***Edit***](#edit-supplier) its information, make a new [***Order***](#placing-orders-to-suppliers) to that supplier, see its [***Catalogue***](#supplier-catalogue) or ***Remove*** it from the database.

### Edit supplier
![EditSupplier](GUIimages/EditUser_Supplier.png)

Here it is possible to edit the Supplier's information and [add](#add-item-supplier) a list of the items sold, it can be confirmed by using the ***Save***  button or dismiss by using the ***Go back*** button.

### Add item supplier
![EditSupplier](GUIimages/NewItem.png)
This section allows to add products manually or import them from a .csv file according to a standard format.

### Supplier catalogue
![SupplierCatalogue](GUIimages/SupplierCatalogue.png)

This shows the catalog of a supplier, where the products are shown. It is possible to ***Edit***, ***Order*** or ***Remove*** these items.


## Case 7 - Quality check
![QualitySupervision](GUIimages/QualitySupervision.png)

This screen is inteded for the quality supervisors, where they can look at the recently received items and decide run an [***Inpection***](#Inspection) on some of them.

### Inspection
![QualityCheck](GUIimages/Qualitycheck.png)

After doing a test, the quality supervisor can select the type of test he performed and indicate the result with ***Failed*** or ***Passed***.
At the end he can decide if the item needs to be accepted with ***Accept item*** or rejected with ***Reject item***.


## Case 8 - Show warehouse
![WarehouseOverview](GUIimages/Warehouseoverview.png)

It is possible to have a layout of the warehouse, where green shelves are free, the yellow ones are partially occupied, and the red ones are full.

Clicking on every shelf opens a page with the information on the items stored.
