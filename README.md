# COMP47360 Research Practicum

This project was designed as part of the MSC COMPUTER SCIENCE (CONVERSION) RESEARCH PRACTICUM COMP47360.
The goal of the project was to produce a robust web application that can provide accurate and dynamic travel time estimates for Dublin bus.

### Prerequisites

This application has been built with python 3 and reactjs for a full list of required packages please refer to the requirements.txt file which contains all the modules needed for the successful deployment of the code.

### Installing

```
git clone https://github.com/Manjunathsk92/Dublin-Bus-Repo.git
```
```
pip install -r requirements.txt 
```

To run the web application move into the Dublin-Bus-Repo directory and run:
```
python manage.py runserver
```


## Running the tests

To test the APIs are correct move into the directory “/Dublin-Bus-Repo” and run:
```
python test_api.py
```
To test that react is rendering all UI components correctly run:
```
CI=true npm test
```

## Built With

* [Django](https://djangobook.com) - The web framework used
* [React](https://reactjs.org) - The front end library used
* [mySQL](https://www.mysql.com) - The DataBase used

## Authors

* **Gavin Fitzgerald** - (GavinFitzgerald94)
* **Diarmuid Morgan** - (Diarmuidmorgan)
* **Manjunath Kulkarni** - (Manjunathsk92)
* **Linda Smith** - (flannsmith)

Multiple developers collaborated on some of the commits in this repository in the same virtual machine environment therefore the author names in the Git history may not give an accurate representation of each developer's contribution.

## License

This project is licensed under the GNU General Public License v3.0
