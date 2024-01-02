### Backend Goals

- [x] WE REALLY HAVE TO CHECK IF THOSE PARAMS ARE GOOD ASAP, STANDRALIZE IT WITH IF ELSE.
- [x] Combine all the schemas into single one.
- [x] Group the get all devices and get-a device-by-id into single get function.
- [ ] Expand the schema for more device types. (TVs, mobile phones, game consoles, etc.)
- [x] Implement JWT
- [ ] Research more on Schema.Add() for more fields to be filled by the users based on their needs, thus making the database modular.
      (I.e. User is a TV repair shop that also accepts satellite boxes with the TV's for repair, but we don't have that in the base Schema() so the user can expand it.)

- [x] Check out CORS in order to only allow our website(admin panel/costumer UI) to fetch data.

### Security Goals

- [ ] Check on generating the cookie on Express and sending it automatically.

- [ ] Study what's for the backend to handle and what's for the frontend to handle.

  > - Still have questions regarding where to do the token auth, and security of it.

- [ ] Research more on security of token transfer as a cookie.

### Database Goals

- [ ] Implement auto backups
- [ ] Make the database local for modular packaging.
