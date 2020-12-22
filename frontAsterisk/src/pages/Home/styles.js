import styled from 'styled-components';

import PerfectScrollbar from 'react-perfect-scrollbar';

export const Container = styled.div`
    background: linear-gradient(-90deg, #aaa, #777);
    height: calc(100%);

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

`;

export const Content = styled(PerfectScrollbar)`
    max-height: 460px;
    height: calc(100% - 390px);
    overflow: hidden;

    background: #ddd;
    margin-top: calc(10% - 30px);
    border-radius: 4px;
    padding: 70px;
    font-weight: bold;
    
    .iconTele {
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;

        button {
            width: 190px;
            height: 40px;
            margin-top: 5px;
            border: none;
            border-radius: 4px;
            background: #00CC88;
            color: #666;
            font-weight: bold;
        }
    }

    input {
        width: 190px;
        heigth: 40px;
        margin-bottom: 10px;
        padding: 5px;
        border: 1px solid #aaa;
        border-radius: 4px;
    }

    img {
        width: 50px;
        height: 50px;
        margin-bottom: 20px;
        background: #ddd;
        color: #000;
      }
`;