// Essa é uma forma de criar uma API diretamente pelo next. 
// Acessando o caminho localhost:3000/api a função abaixo será executada, como um controller

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(request: NextApiRequest, response: NextApiResponse){
    response.status(200).json({message: 'olá mundo'})
}