def name(fname, mname = "Jhon", lname = "Whatson"):
    print("Hello,", fname, mname, lname)

name("Amy")

def name(fname, mname, lname):
    print("Hello,", fname, mname, lname)

name(mname = "Peter", lname = "Wesker", fname = "Jade")

def name(fname, mname, lname):
    print("Hello,", fname, mname, lname)

name("Peter", "Quill")

def name(fname, mname, lname):
    print("Hello,", fname, mname, lname)

name("Peter", "Ego", "Quill")

def name(*name):
    print("Hello,", name[0], name[1], name[2])

name("James", "Buchanan", "Barnes")

def name(**name):
    print("Hello,", name["fname"], name["mname"], name["lname"])

name(mname = "Buchanan", lname = "Barnes", fname = "James")

def name(fname, mname, lname):
    return "Hello, " + fname + " " + mname + " " + lname

print(name("James", "Buchanan", "Barnes"))