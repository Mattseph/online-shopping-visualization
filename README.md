# Admin-Dashboard
Create Responsive Admin Dashboard using Html CSS &amp; Javascript | Simple Dashboard Template Design (Online Tutorials yt)

# Dataset Overview - Online Shopping Dataset by Jackson Divakar R.

## Data Source
### The dataset was shared by Mr. Jackson Divakar R. at Kaggle.com. The dataset  offers a comprehensive data of online shopping in the US. Researchers and data analysts can utilize this dataset to explore the complexities of consumer interactions within the online shopping domain, discovering valuable insights applicable to diverse data-driven applications. These applications may include conducting market research, analyzing trends, and predicting customer behavior, thus contributing to a deeper understanding of the dynamics shaping online retail experiences.

### Kaggle Link: https://www.kaggle.com/datasets/jacksondivakarr/online-shopping-dataset

## Data Structure
### The online shopping data is organized in a structured format and is stored in a CSV (Comma-Separated Values) file format. This structured data format ensures that information related to online shopping, including various attributes such as customer details, product information, and other relevant data points, is systematically arranged for easy accessibility and analysis. The CSV format, being plain text and highly versatile, facilitates seamless integration into various data analysis tools and platforms, enabling researchers and analysts to efficiently explore, manipulate, and derive valuable insights from the online shopping dataset.

## Dataset Attributes

1. ID <br>
Description: The unique identifier of each record in the dataset <br>
Data Type: Numeric <br>
2. CustomerID
Description: Unique identifier for each customer.
Data Type: Numeric
3. Gender
Description: Gender of the customer (e.g., Male, Female).
Data Type: Categorical
4. Location
Description: Location or address information of the customer.
Data Type: Text
5. Tenure_Months
Description: Number of months the customer has been associated with the 
platform.
Data Type: Numeric
6. Transaction_ID
Description: Unique identifier for each transaction.
Data Type: Numeric
7. Transaction_Date
Description: Date of the transaction.
Data Type: Date
8. Product_SKU
Description: Stock Keeping Unit (SKU) identifier for the product.
Data Type: Text
9. Product_Description
Description: Description of the product.
Data Type: Text
10. Product_Category
Description: Category to which the product belongs.
Data Type: Categorical
11. Quantity
Description: Quantity of the product purchased in the transaction.
Data Type: Numeric
12. Avg_Price
Description: Average price of the product.
Data Type: Numeric
13. Delivery_Charges
Description: Charges associated with the delivery of the product.
Data Type: Numeric
14. Coupon_Status
Description: Status of the coupon associated with the transaction.
Data Type: Categorical
15. GST
Description: Goods and Services Tax associated with the transaction.
Data Type: Numeric
16. Date
Description: Date of the transaction (potentially redundant with Transaction_Date).
Data Type: Date
17. Offline_Spend
Description: Amount spent offline by the customer.
Data Type: Numeric
18. Online_Spend
Description: Amount spent online by the customer.
Data Type: Numeric
19. Numberic_Month
Description: Month of the transaction in numeric value
Data Type: Numeric
20. Coupon_Code
Description: Code associated with a coupon, if applicable.
Data Type: Text
21. Discount_pct
Description: Percentage of discount applied to the transaction.
Data Type: Numeric
22. Month
Description: Month of the transaction 
Data Type: Categorical

## Data Quality

### While the online shopping dataset is generally in good condition and has been recently updated, it is not without its challenges, particularly during the data processing phases. One notable issue in this dataset is the presence of missing values, which can arise due to various reasons such as incomplete data entry, system errors, or unavailability of certain information for specific transactions. Even with a recent update, it's not uncommon for gaps in the dataset to exist, necessitating careful consideration during the analysis.

## Data Size

### The dataset consists of a comprehensive set of 22 columns, each representing a distinct attribute within the data. These columns cover a wide range of information, encompassing unique identifiers such as CustomerID and Transaction_ID, categorical variables like Gender and Product_Category, and numeric fields including Tenure_Months, Quantity, and Delivery_Charges. With a total of 52,925 rows, the dataset contains a substantial number of detailed records or observations across various attributes and instances. The dataset, with its configuration of 22 columns and more than 52,000 rows, forms a significant reservoir of data that facilitates comprehensive analysis and exploration of trends in online shopping, customer behaviors, and transaction patterns. This dataset's breadth and depth offer researchers and data analysts a robust foundation to extract valuable insights, contributing to a comprehensive understanding of the online shopping landscape.

## Relevance to Project Goals

### The online shopping dataset is highly relevant to our project, where we are expected to develop an app capable of loading, cleansing, visualizing data, and applying analytics techniques like descriptive and predictive analytics. This dataset serves as a valuable repository of information encompassing diverse aspects of customer interactions, product details, and transaction histories. The dataset is a foundational resource, populating our app's database with a significant amount of data points. The dataset introduces challenges such as missing values necessitating robust cleansing and preprocessing procedures. By addressing issues like missing values in the dataset, our project can ensure the delivery of accurate and reliable insights. The dataset's richness contributes significantly to the visualization component, enabling users to explore and analyze a broad spectrum of variables. Lastly, its comprehensive nature allows for the implementation of advanced analytics techniques, including both descriptive analytics to understand historical patterns and predictive analytics to anticipate future trends

# Getting Started

## Required Apps/Programs for the Application

1. XAMPP - https://www.apachefriends.org/download.html
2. Code Editor (VSCode) - https://code.visualstudio.com/Download
3. GitBash - https://git-scm.com/downloads

## Installation and Startup Guide

1. Access the repository of the application in this github repository:
Github Repository Link: https://github.com/Mattseph/online-shopping-visualization
2. Run the system terminal
3. Clone the repository to your local system and run this git command:
# git clone https://github.com/Mattseph/online-shopping-visualization.git
4. Change directory to online-shopping-visualization
# cd online-shopping-visualization
5. Run the application through VSCode with the command:
# code . 
6. Start Apache in XAMPP
7. Access the application through this link:
# http://localhost/online-shopping-visualization/