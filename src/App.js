import React,{useCallback,useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { gql,useQuery,useMutation } from '@apollo/client';
import {useIndexResourceState, Card, IndexTable, TextStyle,ButtonGroup,Button} from '@shopify/polaris';

export const getData=gql`
query  {
  books {
    id
    title
    author
  }
}
`

export const deleteData=gql`
mutation deleteDa($delete:BookInput) {
  deleteBook(input:$delete) {
     title
    id
  }
}

`



function App() {
  
   const { loading:getDataLoading, error:getDataError, data:getDataData } = useQuery(getData);
   console.log("🚀 ~ file: App.js ~ line 31 ~ App ~ getDataData", getDataData)

  const [deleteDa, {data,loading,error}] = useMutation(deleteData) 
  console.log("🚀 ~ file: App.js ~ line 34 ~ App ~ data", data)
  
  

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
  useIndexResourceState([]);
  const deleteHandler=useCallback(
    (id) => {
    
     deleteDa({
       variables:{
         delete:{
        id:id
         }
       },
       refetchQueries: [{ query:getData  }]
     })
  
     
    },
    [],
  )
const rowMarkup = getDataData && getDataData.books.map(
  (item, index) => (
    
    <IndexTable.Row
      id={item.id}
      key={index}
     
      // position={index}
    >
      <IndexTable.Cell>
        <TextStyle variation="strong">{item.title}</TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextStyle variation="strong"><div>
        <ButtonGroup segmented>
  <Button>save</Button>
  <Button onClick={()=>deleteHandler(item.id)}>delete</Button>
  
</ButtonGroup>
          </div></TextStyle>
      </IndexTable.Cell> 
    </IndexTable.Row>
  ),
);




const resourceName = {
  singular: 'customer',
  plural: "customers"
  
};

  return (
    <Card>
    <IndexTable
      resourceName={resourceName}
      itemCount={getDataData && getDataData.books.length}
      
      // onSelectionChange={handleSelectionChange}
      headings={[
        {title: ''},
        
      ]}
    >
      {rowMarkup}
    </IndexTable>
   
  </Card>
  );
}

export default App;
