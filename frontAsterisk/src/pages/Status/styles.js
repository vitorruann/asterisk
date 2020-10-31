import styled from 'styled-components';

import PerfectScrollbar from 'react-perfect-scrollbar';

export const Container = styled.div`
  background-color: #444444;
  height: 100%;
`;

export const Header = styled.div`
  margin-bottom: 60px;
  padding-top: 10px;

  h1 {
    padding-top: 10px;
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    color: #fff;
  }
`;

export const StatusExten = styled(PerfectScrollbar)`
  overflow: hidden;
  height: 700px;
  margin-right: 10px;
  background: #eeee;
  padding-bottom:10px;
  border-radius: 4px;
  text-align: center;

  h1 {
    padding-top: 10px;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 15px;
    margin-top: 30px;
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

  
`;

export const BoxStatus = styled.li`
  margin: 0 10px 0 10px;
  padding: 20px;
  border-radius: 4px;
  font-weight: bold;
  color: ${(props) => props.status === 'Ramal indisponível' ? '#aaa' : '#000'};
  background-color: ${
  (props) => (props.status === 'Ramal livre' ? '#00CC88' : '#777' &&
    props.status === "Ramal em uso" ? '#ff9d5f' : '#777' &&
    props.status === "Ramal ringando" ? '#00ccdd' : '#777' &&
    props.status === "Ramal em espera" ? '#fdfd96' : '#777' &&
    props.status === "Ramal indisponível" ? '#ccc' : '#777')
  
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

export const InfoExten = styled(PerfectScrollbar)`
  overflow: hidden;
  max-height: 700px;
  margin-left: 10px;
  background: #eeee;
  padding-bottom:10px;
  border-radius: 4px;
  text-align: center;


  h1 {
    padding-top: 10px;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }

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


