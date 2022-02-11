import React, {useState, useEffect} from 'react'

//ReactDataGrid.io used for main grid
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment'

import './products.css'
import NewVersion from './NewVersion.jsx';

const returnProductGrid = (id) => {
    return fetch('/returnProductGrid/' + id).then(response => {
      return response.json()
    });
}

const returnProductList = () => {
    return fetch('/returnProductList').then(response => {
      return response.json()
    });
}



function Products  () {
    document.title = 'HQ Business - Products';

    const noSelected = {
        MailingList: "",
        ProductID: null,
        ProductName: "Select a Product",
        ProductURL: ""
    }

    const [dataSource, setDataSource] = useState({});
    const [currentProduct, setCurrentProduct] = useState(noSelected);
    const [products, setProducts] = useState([]);


    const onChangeSelect = (product) => {
        returnProductGrid(product.ProductID).then((data) => {
                setDataSource(data);         
        });
        //console.log(products);
    }

    const reLoadGrid = (product) => {
        
        returnProductGrid(product.ProductID).then((data) => {
                setDataSource(data);         
        });
        //console.log(dataSource);
    }

    useEffect(() => {
        let mounted = true;
        
        returnProductList().then((data) => {
            if(mounted) {
                setProducts(data);   
            }       
        });        
        return () => mounted = false;
        
    }, []);

    const columns = [
        {name: 'Datetime', header: 'Date', type: 'string', defaultFlex: 1,
            sort: (a, b) => {
                a = moment(a, 'DD/MM/YYYY', true).format();
                b = moment(b, 'DD/MM/YYYY', true).format();
    
                return new Date(a) - new Date(b);
            }
        },
        {name: 'Version', header: 'Version', type: 'string', defaultFlex: 1},
        {name: 'Username', header: 'User', type: 'string' , defaultFlex: 1},
        {name: 'UpdateDesc', header: 'Description', type: 'string', minWidth:1255 , defaultFlex: 1}
    ]
    const gridStyle = { minHeight:750, margin:10 }
    const theme = 'default-dark'
    //const defaultSortInfo = { name: 'Version', dir: -1 }

    return(
        <>
        <div className='Products'>
            <Row size='xs'>
                <Col>
                    <NewVersion product={currentProduct} reLoad={reLoadGrid}/>
                </Col>
                <Col>
                <h3>{currentProduct.ProductName}</h3>
                </Col>
                <Col>
                <h6 className='productURL'><a href={currentProduct.ProductURL}>{currentProduct.ProductURL}</a></h6>
                </Col>
                <Col>
                </Col>
                <Col >
                    <Form.Control as="select" value={JSON.stringify(currentProduct)} style={{ display:'inline', margin:5, width:400}}
                        onChange = {e=> {
                            setCurrentProduct(JSON.parse(e.target.value));
                            //console.log(e.target.value);
                            onChangeSelect(JSON.parse(e.target.value));
                        }}>
                        <option key={0} value={JSON.stringify(noSelected)}>{noSelected.ProductName}</option>
                        {
                          products.map((product, index) => {
                              return(<option key={index} value={JSON.stringify(product)}>{product.ProductName}</option>)
                            })
                        }
                    </Form.Control>
                </Col>
            </Row>
            <Row>
                <ReactDataGrid 
                    idProperty="id"
                    columns={columns}
                    dataSource={dataSource}
                    style={gridStyle}
                    theme={theme}
                    editable={true}
                    //defaultSortInfo={defaultSortInfo}
                />
            </Row>
            

        </div>
        </>
    )
}

export default Products;