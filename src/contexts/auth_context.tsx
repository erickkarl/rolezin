import React,{ createContext, useState } from "react";
import * as Google from 'expo-google-app-auth';
import axios from 'axios'

interface AuthContextData {
    signed: boolean;
    user: object;
    signIn(): Promise<void>;
    fTest(url:string): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({children}){

    const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);
    const [userInfo, setUserInfo] = useState<Google.GoogleUser|null>();

    const fTest = (url:string) => {
        console.log("doing scraping...");
        axios.get(url)
            .then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        }

    const signIn = () => {
        const config = {
            androidClientId: "892471913566-v8kiqcehtkr9ev6uo4fclt8o6nn0rp41.apps.googleusercontent.com",
            scopes: ['profile','email']
        }

        Google.logInAsync(config)
            .then((result) => {
            const {type, user} = result;
            if(type == 'success'){
                setUserInfo(user);
                console.log('SUCESSO');
                setIsSignedIn(true);
            }
            else{
                console.log('Falha')
            }
        }).catch(error => {
            console.log(error);
        })

    }

    return(
        <AuthContext.Provider value={{signed: isSignedIn, user:userInfo, signIn, fTest}}>
            {children}
        </AuthContext.Provider>
    );
}


