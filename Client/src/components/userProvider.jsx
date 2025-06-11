// // import React, { createContext, useState, useContext } from 'react';

// // const UserContext = createContext();

// // export const UserProvider = ({ children }) => {
// //     const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || { id: -1,name: '' });

// //     return (
// //         <UserContext.Provider value={{ currentUser, setCurrentUser }}>
// //             {children}
// //         </UserContext.Provider>
// //     );
// // };

// // export const useCurrentUser = () => useContext(UserContext);
// import React, { createContext, useState, useContext } from 'react';
// import Cookies from 'js-cookie';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(() => {
//         const userFromCookie = Cookies.get('currentUser');
//         return userFromCookie ? JSON.parse(userFromCookie) : { id: -1, name: '' };
//     });

//     return (
//         <UserContext.Provider value={{ currentUser, setCurrentUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useCurrentUser = () => useContext(UserContext);
