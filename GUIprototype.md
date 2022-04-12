# Graphical User Interface Prototype  

Authors: 
* Alessio Carachino
* Samuele Giangreco
* Daniel Guarecuco
* Zoltan Mazzuco

Date: 13 april 2022

Version: #1


# Screenshots

## Case 1 - Log-in

### Regular Log-in
![ManagerLogin](GUIimages/Login.png)

This is the view presented to all users trying to use the application. If any user tries to connect to any other page without being authenticated, they will be redirected here for login.

* The user is requested to provide e-mail and password.
* The ***Login*** button send the form for authentication with the backend.
  * If it is the first time the user tries to log in, they will be redirected to the [Firt-time log-in](#firt-time-log-in) screen.
  * Otherwise, they will be redirected to the [Dashboard](#case-2---dashboard) screen.

### Firt-time Log-in

![ManagerLogin](GUIimages/Firstlogin.png)

This view is presented to all users that are trying to access the application for the first time after the administrator have created their accounts. They are requested to change their default password. Failure to change the password will reject the authentication.
* By pressing ***Submit*** the user is redirected to the [Dashboard](#case-2---dashboard) screen.


## Case 2 - Dashboard
![MainMenu](GUIimages/Mainmenu.png)

The main menu of the application it is possible to [Manage items](#case-3---manage-items), [Manage users](#manage-users), 


## Case 3 - Manage items
![ManageItems](GUIimages/ManageItems.png)

This view shows the available items in the warehouse and their informations:
* ID: is a unique identifier for an item sold by a specific Company
* Category
* Product/Item
* Name/Company: is the supplier from which the item is bought
* Min Amount: shows the minimum amount of that item that we always want to have available, it checks all the Suppliers it is bought from
* Amount: shows the amount of that item that is available in the warehouse
* Price: is the price at which the supplier sells the item
* Shelf: is the physical position of the item in the warehouse

* Options:
  * By pressing ***Edit*** the user is redirected to the [Edit Items](#edit-items) screen.

Items can be filtered by category, item or company or a more specific search could be done with the search bar on the right. 
Changing the granularity of the view means that some tabs will not be shown for example the price when we are grouping by items.

### Edit items
![EditItems](GUIimages/EditItem.png)
For each product it is possible to modify the quantity, the price and its position.
Changes can be confirmed or Aborted.


## Case 4 - Manage users

### Manage users
![Manageuser](GUIimages/ManageUsers.png)
In this page the administrator is able to see several informations about employees and suppliers, and they can be filtered by role or searched by many attributes.

A new user can be added by pressing ***Add user*** where we can add a [New Employee](#new-employee) or a 
[New Supplier](#new-supplier)

It is possible to [edit a user](#edit-user) by selecting ***Edit*** or removing one with ***Remove***

### New employee
![NewUserEmployee](GUIimages/CreateUser_OU_Manager.png)


### New supplier
![NewUserSupplier](GUIimages/CreateUser_Supplier.png)


### Edit user
![EditEmployee](GUIimages/EditUser_OU_Manager.png)



## Case 5 - Manage orders

### List orders to suppliers
![OrderSupplier](GUIimages/ManageOrders_suppliers.png)
The list of all older to Suppliers, By changing the drop-down menu on the left to ***Internal Orders*** it is possible to switch to the [Internal Orders](#list-internal-orders). The view can be grouped by item and/or supplier, and it can be done a search by a specific field.

By selecting ***Details*** we can see the [Order details](#order-details), or we can ***Delete*** the order only if it is in pending state

### Order details
![OrderDetails](GUIimages/OrderDetails_Suppliers.png)
Here we can check the order details. Specifically for order to supplier we have the Price per unit, the total price and the ***Recepit*** button do download it. It is also possible to cancel and order, if not already shipped, with ***Cancel Order*** or make the same order again with ***Order Again***.

### List internal orders
![OrderInternal](GUIimages/ManageOrders_internal.png)
The list of all internal order, By changing the drop-down menu on the left to ***Orders to Suppliers*** it is possible to switch to the [Orders to suppliers](#list-orders-to-suppliers). The view can be grouped by item and/or Organizational unit that is performing the order, and it can be done a search by a specific field

### Placing Internal Orders
![PlacingOrder](GUIimages/InternalOrder.png)
An internal order can be placed by selecting the quantities of each item and preceding to ***Order*** to be redirected to the [order confirmation](#internal-orders-confirmation) page, it is also possible to ***Go back*** aborting the order and returning to the previous page.

### Internal Orders Confirmation
![OrderConfirmation](GUIimages/InternalOrderconfirmation.png)
Confirmation page for a new Internal order. It is possible to cancel an order not already processed.

### Placing orders to suppliers
![IssueOrder](GUIimages/IssueOrder.png)
Here are shown the informations on the products that are being purchased from a supplier.
It is possible to modify the quantity of an item, adding more products of the same supplier, ***abort*** or ***confirm*** the order.


## Case 6 - Manage suppliers
### Manage supplier
![ManageSupplier](GUIimages/ManageSuppliers.png)
For each Supplier it is possible to [***Edit***](#edit-supplier) their informations, make a new [***Order***](#placing-orders-to-suppliers) to that supplier, see his [***Catalogue***](#supplier-catalogue) or ***Remove*** him from the database

### Edit supplier
![EditSupplier](GUIimages/EditUser_Supplier.png)

Here it is possible to edit Supplier's informations and [add](#add-item-supplier) a list of the items he sells, then we can ***Save*** or ***Go back*** to the previous page

### Add item supplier
![EditSupplier](GUIimages/NewItem.png)
Here we can add products manually or import them from a .csv file

### Supplier catalogue
![SupplierCatalogue](GUIimages/SupplierCatalogue.png)

Finally, in the catalog we can check the items of a specific supplier and ***Edit***, ***Order*** or ***Remove*** them


## Case 7 - Quality check
![QualitySupervision](GUIimages/QualitySupervision.png)

Here quality supervisors can look at the recently received items and decide to [***check***](#check) some of them.

### check
![QualityCheck](GUIimages/Qualitycheck.png)

After doing a test, the quality supervisor can select the type of test he performed and indicate the result with ***Failed*** or ***Passed***.
At the end he can decide if the item needs to be accepted with ***Accept item*** or rejected with ***Reject item***.


## Case 8 - Show warehouse
![WarehouseOverview](GUIimages/Warehouseoverview.png)

It is possible to have a graphical view of the warehouse where the green shelves are free, the yellow ones are partially occupied, and the red ones are full.

Clicking on every shelf opens a page with the informations on the items stored.
