# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
     
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence
    (ex: step1: class A, step 2: class A+B, step 3: class A+B+C, etc)> 
    <Some steps may  correspond to unit testing (ex step1 in ex above), presented in other document UnitTestReport.md>
    <One step will  correspond to API testing>

    The integration approach used is **top down**.

* **Step 1**: API class tested 
* **Step 2**: DAO classes tested
    


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||


## Step 2
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||


## Step n 

   
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||




# API testing - Scenarios


# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
|  1.1         | FRx                             |             |             
|  1.2         | FRy                             |             |             
| 1.3        |                                 |             |             
| 2.1        |                                 |             |             
| 2.2        |                                 |             |             
| 2.3       |                                 |             |          
| 2.4       |                                 |             |             
| 2.5    |                                 |             |             
| 3.1     |                                 | addRestockOrder(),              |             
| 3.2       |                                 | addRestockOrder(),            |             
| 4.1      |                                 |             |             
| 4.2       |                                 |             |             
| 4.3        |                                 |             |             
| 5.1.1      |                                 | updateRestockOrder(), updateRestockOrderSKUItems()             |             
| 5.2.1      |                                 | updateRestockOrder()            |             
| 5.2.2       |                                 | updateRestockOrder()            |             
| 5.2.3       |                                 | updateRestockOrder()            |             
| 5.3.1        |                                 | updateRestockOrder()            |             
| 5.3.2        |                                 | updateRestockOrder()             |             
| 5.3.3      |                                 | updateRestockOrder()             |             
| 6.1     |                                 | getAllReturnablesById(), addReturnOrder()            |       
| 6.2     |                                 | getAllReturnablesById(), addReturnOrder()             |             
| 7.1     |                                 |             |             
| 7.2      |                                 |             |             
| 9.1    |                                 |             |             
| 9.2     |                                 |             |             
| 9.3       |                                 |             |             
| 10.1      |                                 |             |   
| 11.1      |                                 |             |             
| 11.2      |                                 |             |             
| 12.1      |                                 |             |             
| 12.2      |                                 |             |             
| 12.3     |                                 |             |             






# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
|                            |           |

