import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import React, { useState, useRef, useEffect } from 'react';

import { api } from '../../services/api'

export function Home() {
    const [submitted, setSubmitted] = useState(true);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [description, setDescription] = useState('')
    const [openNewDialog, setNewDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentDelete, setCurrentDelete] = useState('')
    const [inputIsEmpty, setInputIsEmpty] = useState(false);
    const [data, setData] = useState([])

    useEffect(() => {
        if (submitted) {
            async function get() {
                try {
                    const { data } = await api.get('/chamarotas/read')
                    setData(data.reverse())
                } catch (error) {
                    console.log(error)
                }
            }

            get()
        }
    }, [submitted]);

    
    
    async function saveData() {
        setSubmitted(false)
        
        if (description.trim().length > 0) {
            try {
                await api.post('/chamarotas/creat', {
                    texto: description
                })
                setSubmitted(true)
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Card Criado', life: 3000 });
            } catch (error) {
                console.log(error)
            }
            
            setNewDialog(false);
            setDescription('')
        } else {
            setInputIsEmpty(true)
        }
    }
    
    async function updateData() {
        setSubmitted(false)
        
        if (description.trim().length > 0) {
            try {
                await api.patch('/chamarotas/update', {
                    _id: currentDelete,
                    texto: description
                })
                setSubmitted(true)
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Card Atualizado', life: 3000 });
            } catch (error) {
                console.log(error)
            }
            setOpenUpdateDialog(false);
            setDescription('')
            setInputIsEmpty(false)
        } else {
            setInputIsEmpty(true);
        }
    }
    
    async function deleteDataList() {
        setSubmitted(false)
        try {
            await api.delete('/chamarotas/delete', {
                data: {_id: currentDelete}
            })
            setSubmitted(true)
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Card Deletado', life: 3000 });
        } catch (error) {
            console.log(error)
        }
        
        setOpenDeleteDialog(false)
        // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
    
    
    const hideNewDialog = () => {
        setNewDialog(false)
        setInputIsEmpty(false)
    }
    
    const hideUpdateDialog = () => {
        setOpenUpdateDialog(false)
        setDescription('')
    }
    
    const hideDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }
    
    const handleUpdateData = (rowData) => {
        setOpenUpdateDialog(true)
        setInputIsEmpty(false)
        setDescription(rowData.texto)
        setCurrentDelete(rowData._id)
    }
    
    const handleDeleteData = (rowData) => {
        setOpenDeleteDialog(true)
        setCurrentDelete(rowData._id)
    }
    
    const leftToolbarTemplate = () => {
        return (
            <Button
                label="Novo"
                icon="pi pi-plus"
                className="p-button-success p-mr-2"
                onClick={() => setNewDialog(true)}
            />        
        )
    }
        
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-mr-2"
                    onClick={() => handleUpdateData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => handleDeleteData(rowData)}
                />
            </>
        );
    }
    
    const header = (
        <div className="table-header">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Procurar..."
                />
            </span>
        </div>
    );
    
    const newDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideNewDialog}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text"
                onClick={saveData}
            />
        </>
    );

    const updateDialogFooter = (
        <>
            <Button 
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideUpdateDialog}
            />
            <Button 
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text"
                onClick={updateData}
            />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button
                label="Não"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDeleteDialog}
            />
            <Button
                label="Sim"
                icon="pi pi-check"
                className="p-button-text"
                onClick={deleteDataList}
            />
        </>
    );

    return(

        <div className="datatable-crud-demo">      
            <Toast ref={toast} />
            <div className="card">
                <Toolbar
                    className="p-mb-4"
                    left={leftToolbarTemplate}
                />

                <DataTable
                    ref={dt}
                    value={data}
                    dataKey="id"
                    paginator
                    rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column
                        field="_id"
                        header="Id"
                        // sortable 
                    />
                    <Column
                        field="texto"
                        header="Descrição"
                        // sortable
                    />
                    <Column body={actionBodyTemplate} />
                </DataTable>
            </div>

            <Dialog
                visible={openNewDialog}
                style={{ width: '450px' }}
                header="Detalhes"
                modal
                className="p-fluid"
                footer={newDialogFooter}
                onHide={hideNewDialog}
                // draggable
            >
                <div className="p-field">
                    <label htmlFor="description">Descrição</label>
                    <InputTextarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={3}
                        cols={20}
                    />
                    {inputIsEmpty && <small className="p-error">Descrição obrigatória.</small>}
                </div>
            </Dialog>

            <Dialog
                visible={openUpdateDialog}
                style={{ width: '450px' }}
                header="Detalhes"
                modal
                className="p-fluid"
                footer={updateDialogFooter}
                onHide={hideUpdateDialog}
                // draggable
            >
                <div className="p-field">
                    <label htmlFor="description">Descrição</label>
                    <InputTextarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={3}
                        cols={20}
                    />
                    {inputIsEmpty && <small className="p-error">Descrição obrigatória.</small>}
                </div>
            </Dialog>

            <Dialog 
                visible={openDeleteDialog}
                style={{ width: '450px' }}
                header="Confirmação"
                modal
                footer={deleteDialogFooter}
                onHide={hideDeleteDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    <span>Tem certeza que deseja excluir?</span>
                </div>
            </Dialog>
        </div>
    )
}