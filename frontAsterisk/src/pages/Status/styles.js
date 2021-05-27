import styled from 'styled-components';

import PerfectScrollbar from 'react-perfect-scrollbar';

export const Container = styled.div`
  background: linear-gradient(-90deg, #aaa, #777);
  height: 100%;

  .Titulos {
    display: flex;
    margin: 10px;
    padding: 10px 20px;
    background-color: #ddd;
    border-radius: 4px;
    max-height: 50px;
    overflow-x: hidden;
  }

  h5 {
    padding-left: 10px;
    font-weight: bold;
  }

  .row {
    margin-right: 0px;
    margin-left: 0px;
    height: calc(100% - 140px);
  }
`;

export const Header = styled.div`
  margin-bottom: 60px;
  padding-top: 10px;
  background-color: #ddd;
  display: flex;
  justify-content: flex-start;

  img {
    margin-left: 20px;
    width: 40px;
    height: 40px;
    background: #ddd;
    color: #000;
  }

  div {
    width: 100%;
    align-items: center;
    text-align: center;
  }

  h2 {
    margin-left: 20px;
    font-weight: bold;
  }
`;

export const StatusRegister = styled.h1`
  color: ${(props) => props.status === 'registered' ? '#00CC88' : '#000' &&
  props.status === "notRegistered" ? '#ff6961' : '#000' };
  background-color: #fff;
`;

export const StatusExten = styled(PerfectScrollbar)`
  overflow: hidden;
  margin-right: 10px;
  background: transparent;
  padding-bottom:10px;
  border-radius: 4px;
  text-align: center;



  ul {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;
    margin: 30px 58px 0px 58px;
    list-style: none;
  }

  button {
    position: absolute;
    left: calc(58% - 110px);
    top: calc(100% - 40px);
    border: none;
    background-color: transparent;
    border-radius: 4px;
  }

  .bt1 {
    position: absolute;
    left: calc(58% - 150px);
    top: calc(100% - 40px);
    border: none;
    background-color: transparent;
    border-radius: 4px;
  }

  #Details {
    display: none;
    height: 0px;
  }

  .Status:hover #Details{
    display: block;
  }
`;

export const BoxStatus = styled.li`
  padding: 20px;
  border-radius: 4px;
  font-weight: bold;
  color: ${(props) => props.status === 'Ramal indis.' ? '#aaa' : '#000'};
  background-color: ${
  (props) => (props.status === 'Ramal livre' ? '#00CC88' : '#777' &&
    props.status === "Ramal em uso" ? '#ff9d5f' : '#777' &&
    props.status === "Ramal ringando" ? '#00ccdd' : '#777' &&
    props.status === "Ramal em espera" ? '#fdfd96' : '#777' &&
    props.status === "Ramal indis." ? '#ccc' : '#777')
  
  };

  label {
    display: block;
    margin: 5px;
  }

  label:nth-child(2) {
    color: ${(props) => props.status === 'Ramal indisponível' ? '#aaa' : '#666' &&
    props.status === 'Ramal não encontrado' ? '#000' : '#666'};
  }
`;

export const BoxDetails = styled.div`
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  width: 110px;
  top: calc(-10% - 50px);
  left: calc(70%);
  padding: 5px;
  border-radius: 4px;
  font-weight: bold;

  label {
    display: block;
  }

  // label > + 1{
  //   display: ${(props) => props.typeExten === 'Zap' ? 'none' : 'block'}
  // }
`;

export const InfoExten = styled(PerfectScrollbar)`
  overflow: hidden;
  height: calc(100% - 140px);
  margin-left: 10px;
  background: transparent;
  padding-bottom:10px;
  border-radius: 4px;
  text-align: center;

  ul {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 15px;
      margin: 20px;
      list-style: none;
    }
`;

export const InfoBox = styled.li`
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
  background-color: #ccc;

  strong {
    display: block;
    padding-top: 10px;
  }

  span {
    display: block;
  }

  span:last-child{
    padding-bottom: 10px;
  }
`;

export const Phone = styled(PerfectScrollbar)`
    overflow: hidden;
    margin-top: 40px;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 30px 0px 30px 0px;
    border: 3px solid #ccc;
    border-radius: 4px;



    h1 {
      font-weight: bold;
      margin-bottom: 20px;
    }

    .display {
      width: 240px;
      border: none;
      border-radius: 4px;
      margin-bottom: 20px;
      padding-bottom: 30px;
      font-size: 20px;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .directions {
      width: 30px;
      height: 30px;
      font-size: 13px;
      font-weight: bold;
      border: none;
      border-radius: 50%;
      margin: 1px;
    }

    .divVol {
      display: flex;
      
      div:first-child {
        width: 48%;
      }
      div:last-child {
        width: 48%;
      }
    }



    .keyVol {
      margin-right: 10px;
      width: 25px;
      height: 25px;
      font-size: 15px;
    }

    .keyPhone {
      width: 80px;
      height: 45px;
      font-size: 20px;
      font-weight: bold;
      border: none;
      border-radius: 4px;
      margin: 1px;
    }

    button {
      margin: 2px;
      width: 120px;
      height: 40px;
      font-size: 20px;
      font-weight: bold;
      border: none;
      border-radius: 4px;
    }
`;