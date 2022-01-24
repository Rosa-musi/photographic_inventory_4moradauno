import React, {useState, createContext, useEffect} from 'react'

import { firestore } from '../Firebase/config'
import {doc, getDoc, onSnapshot } from 'firebase/firestore'

export const FilesContext = createContext();

export const FilesProvider = (props) => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [propiedades, setPropiedades] = useState(null);
    const [infoUser, setInfoUser] = useState()
    const [infoSeccion, setInfoSeccion] = useState([])
    const [seccion, setSeccion] = useState()
    const [propiedadQueSubeFotos, setPropiedadQueSubeFotos] = useState()
    const [infoPropiedad, setInfoPropiedad] = useState()
    const [arrayNumerosContratos, setArrayNumerosContratos] = useState()

    async function getInfo (coleccion, idDocumento) {
        const docuRef= doc(firestore, `${coleccion}/${idDocumento}`)
        const consulta = await getDoc(docuRef)
        const infoDocu = consulta.data();
        return infoDocu
    } //onSnapShot


     useEffect(() => {
        async function fetchCasas(){
            const casas = await getInfo("array_contratos", "numeros_contrato")  
            setArrayNumerosContratos(casas.numeros)
        }
        fetchCasas()
    }, [])

    /* useEffect(() => {
        onSnapshot(doc(firestore, "contratos", "1"), (doc) => {
          setEsto(doc.data())
        })
    }, []);  */

    return(
        <FilesContext.Provider value ={{
            email,
            setEmail,
            password,
            setPassword,
            user,
            setUser,
            propiedades,
            setPropiedades,
            infoUser,
            setInfoUser,
            infoSeccion, 
            setInfoSeccion,
            seccion,
            setSeccion,
            getInfo,
            propiedadQueSubeFotos,
            setPropiedadQueSubeFotos,
            infoPropiedad, 
            setInfoPropiedad,
            arrayNumerosContratos
        }}>
            {props.children}
        </FilesContext.Provider>
    )
}