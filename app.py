import csv
import sqlite3
import io
from datetime import datetime
from itertools import count

import matplotlib.pyplot as plt
import numpy as np

from flask import Flask, render_template, redirect, request, url_for, session


# FUNCTIONS

# Create database if not exist
def init_db():

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
                CREATE TABLE IF NOT EXISTS data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    account_number TEXT NOT NULL,
                    transaction_date INTEGER NOT NULL,
                    transaction_type TEXT,
                    secondary_account TEXT,
                    secondary_account_name TEXT,
                    description TEXT,
                    debits REAL,
                    credits REAL,
                    balance REAL,
                    currency TEXT)
            ''')
    conn.commit()
    conn.close()

def init_categorised_users_db():
    print("Categorised users database created")
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
                    CREATE TABLE IF NOT EXISTS categorised_users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        account_name TEXT,
                        category TEXT)
                ''')
    conn.commit()
    conn.close()

def save_categories_to_db(account_name, category):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    cur.execute("SELECT account_name FROM categorised_users")
    users = cur.fetchall()
    for i in range(len(account_name)):
        if account_name not in users:
            cur.execute("INSERT INTO categorised_users VALUES (NULL, ?, ?)", (account_name[i], category[i]))
            con.commit()
    con.close()

# Show data from database
def show_data():

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM data")
    data = cursor.fetchall()
    return data

# Function to make dictionary from list for easier searching through data
def create_dict_from_list(keys, first_list):
    new_dict = {}
    help_list = [[] for _ in range(len(keys))]
    x = 0
    for element in first_list:
        for e in element:
            help_list[x].append(e)
            if x < len(keys)-1:
                x+=1
            else:
                x = 0
            new_dict.update({keys[x]: help_list[x]})
    return new_dict

# Show last date from database
def show_last_date_from_db(data_list):
    if data_list:
        filtered_data = datetime.strptime(data_list[0], "%Y-%m-%d")
    else:
        filtered_data = datetime.strptime("1900-01-01", "%Y-%m-%d")

    return filtered_data.strftime("%Y-%m-%d")

# Read CSV file and save data to database
""" 
1. Check if user choose file then read file from post method and saves it in list
2. Read last row from list which contains the oldest date
3. Compare first date from new CSV file, with last date from database, and if file is newer save new file to database
"""
def save_csv_to_db(selected_keys, last_date):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    file = request.files['file']
    last_date = datetime.strptime(last_date, '%Y-%m-%d')
    if file.filename == '':
        print("No file selected")
        values = ["BRAK"]
    else:
        stream = io.StringIO(file.stream.read().decode("utf-8-sig"))  # "utf-8-sig" to decode first column name
        csv_reader = csv.DictReader(stream)
        rows = list(csv_reader)
        last_row = rows[-1]  # Find last row from CSV file (it contains oldest date)
        first_date = datetime.strptime(last_row['Data transakcji'], "%Y-%m-%d")  # Make date from string
        # If the oldest date from CSV is newer than the newest from database save CSV to db #
        if first_date > last_date:
            filtered_data = [
                tuple(row[key] if key in row else "" for key in selected_keys)
                for row in rows
            ]
            cur.executemany("INSERT INTO data VALUES (NULL,?,?,?,?,?,?,?,?,?,?)", filtered_data)
            con.commit()
            con.close()
            print("Data successfully added to the database")
        else:
            print("Data already in database")

# Show date, and summed debits groupped by month, and year(YYYY-MM), returns filtered_data('month', 'debit')
def check_monthly_values(data_dict, key):
    summed = {}
    for x in range(len(data_dict['Data transakcji'])):
        months = datetime.strptime(data_dict['Data transakcji'][x], "%Y-%m-%d").strftime("%Y-%m")
        if data_dict[key][x] == "":
            debits = 0
        else:
            debits = data_dict[key][x]

        if months in summed:
            summed.update({months: summed[months] + debits})
        else:
            summed.update({months: debits})

    filtered_data = summed.items()
    return filtered_data

def round_value(data_list):
    formatted_list = ['%.2f' % data for data in data_list]
    return formatted_list

# Read data and show all users one time
def show_all_users_once(data_list):
    filtered_list = []
    for data in data_list:
        if data not in filtered_list and data != '':
            filtered_list.append(data)

    return filtered_list

def show_categorised_users():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM categorised_users")
    data = cursor.fetchall()
    return data

def save_changed_categories(account_name, category):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    for account_name, category in zip(account_name, category):
        cur.execute("UPDATE categorised_users SET category = ? WHERE account_name = ?", (category, account_name))
    con.commit()
    con.close()


app = Flask(__name__)
@app.route('/', methods=['GET', 'POST'])

def main_site():
    #VARIABLES
    values = [] # Variables sent to html
    months_debits = []
    debits = []
    months_credits = []
    credits = []
    monthly_difference = []
    x = 0
    selected_keys = ["Id","Numer rachunku/karty", "Data transakcji", "Rodzaj transakcji", "Na konto/Z konta",
                     "Odbiorca/Zleceniodawca", "Opis", "Obciążenia", "Uznania", "Saldo", "Waluta"]  # Nazwy kolumn w pliku CSV

    # RUN FUNCTIONS
    init_db()
    database_data = show_data()  # All data from database
    database_data_dict =  create_dict_from_list(selected_keys, database_data)
    month_debits_data = check_monthly_values(database_data_dict, selected_keys[7])
    month_credits_data = check_monthly_values(database_data_dict, selected_keys[8])
    last_date_from_db = show_last_date_from_db(database_data_dict[selected_keys[2]])
    usernames_data = show_all_users_once(database_data_dict[selected_keys[5]])
    categorised_users = show_categorised_users()
    category_debits = []
    summed_category_debits = []

    for i in range(len(database_data_dict["Odbiorca/Zleceniodawca"])):
        for category in categorised_users:
            if database_data_dict["Odbiorca/Zleceniodawca"][i] in category:
                category_debits.append([
                    category[1],
                    database_data_dict["Obciążenia"][i],
                    category[2]
                ])

    for category in category_debits:
        if not any(category[2] == sublist[0] for sublist in summed_category_debits) and category[1] != '' and category[1] < 0:
            summed_category_debits.append([
                category[2],
                category[1]
            ])
        else:
            for i, sublist in enumerate(summed_category_debits):
                if sublist[0] == category[2] and category[1] != '' and category[1] < 0:
                    summed_category_debits[i][1] += float(category[1])
                    break

    for i in range(len(summed_category_debits)):
        summed_category_debits[i][1] = round(summed_category_debits[i][1], 2)*-1

    current_balance = [database_data_dict['Saldo'][0], database_data_dict['Waluta'][0]]

    for data in month_debits_data:
        months_debits.append(data[0])
        debits.append(data[1])

    for data in month_credits_data:
        months_credits.append(data[0])
        credits.append(data[1])

    for data in credits:
        monthly_difference.append(data + debits[x])
        x+=1


    round_difference = round_value(monthly_difference)
    round_debits = round_value(debits)
    round_credits = round_value(credits)

    # APPEND VALUES
    values.append(last_date_from_db)
    values.append(current_balance)
    values.append(months_debits)
    values.append(round_debits)
    values.append(months_credits)
    values.append(round_credits)
    values.append(round_difference)
    values.append(usernames_data)
    values.append(categorised_users)
    values.append(summed_category_debits)

    # Actions after pressing button in html
    if request.method == "POST": # If user pressed button check if he chooses file
        if 'save_csv' in request.form:
            save_csv_to_db(selected_keys, last_date_from_db)
        elif 'to_categories' in request.form:
            return redirect(url_for('categories_site'))

    return render_template("index.html", values=values)

@app.route('/categories', methods=['GET', 'POST'])
def categories_site():
    values = []
    selected_keys = ["Id", "Numer rachunku/karty", "Data transakcji", "Rodzaj transakcji", "Na konto/Z konta",
                     "Odbiorca/Zleceniodawca", "Opis", "Obciążenia", "Uznania", "Saldo",
                     "Waluta"]  # Nazwy kolumn w pliku CSV
    init_db()
    init_categorised_users_db()
    database_data = show_data()
    database_data_dict = create_dict_from_list(selected_keys, database_data)
    categorised_users_data = show_categorised_users()
    all_users = show_all_users_once(database_data_dict[selected_keys[5]])
    categorised_users = []
    categorised_users_category = []
    uncategorised_users = []

    for user in categorised_users_data:
        categorised_users.append(user[1])
        categorised_users_category.append(user[2])

    for user in all_users:
        if user not in categorised_users:
            uncategorised_users.append(user)

    values.append(uncategorised_users)

    if request.method == "POST":
        if 'save_categories' in request.form:
            categories = {}
            for key, value in request.form.items():
                if key[-1] == '1':
                    key = key[:-1]
                    if key not in categories and value != '' and value != 'Zapisz kategorie' and value != 'Przejdź':
                        categories[key] = value
                else:
                    if value != '' and value != 'Zapisz kategorie' and value != 'Przejdź':
                        categories[key] = value
            save_categories_to_db(list(categories.keys()), list(categories.values()))
        elif 'to_edit_categories' in request.form:
            return redirect(url_for('edit_categories_site'))
        elif 'to_main_site' in request.form:
            return redirect(url_for('main_site'))


    return render_template("add_categories.html", values=values)

@app.route('/edit_categories', methods=['GET', 'POST'])
def edit_categories_site():
    values = []
    categorised_users_data = show_categorised_users()
    values.append(categorised_users_data)
    categorised_users_data.sort(key=lambda x: x[1])
    if request.method == "POST":
        if 'to_main_site' in request.form:
            return redirect(url_for('main_site'))
        if 'save_changes' in request.form:
            categories = {}
            for key, value in request.form.items():
                if key[-1] == '1':
                    key = key[:-1]
                    if key not in categories and value != '' and value != 'Zapisz kategorie' and value != 'Przejdź':
                        categories[key] = value
                else:
                    if value != '' and value != 'Zapisz kategorie' and value != 'Przejdź':
                        categories[key] = value
            save_changed_categories(list(categories.keys()), list(categories.values()))
            print("Zmiany zapisane do bazy danych!")


    return render_template("edit_categories.html", values=values)

if __name__ == '__main__':
    app.run(debug=True)
