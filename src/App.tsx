'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ChevronDown } from 'lucide-react';

interface Types {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

const ArtGallery = () => {
  const [gallery, setGallery] = useState<Types[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Types[]>([]);
  const [rowClick, setRowClick] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(false);
  const [rowNumber, setRowNumber] = useState<number | ''>('');
  const [allGallery, setAllGallery] = useState<Types[]>([]);
  const rowsPerPage = 12;

  const handleSelect = () => {
    setSelected(!selected);
  };

  useEffect(() => {
    fetchGalleryData();
  }, [currentPage]);

  useEffect(() => {
    if (rowNumber && rowNumber > 0) {
      const totalPagesNeeded = Math.ceil(rowNumber / rowsPerPage);

      const fetchAllPages = async () => {
        const allData: Types[] = [];
        for (let page = 1; page <= totalPagesNeeded; page++) {
          try {
            const response = await axios.get(
              `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`
            );
            allData.push(...response.data.data);
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        }
        setAllGallery(allData);
        const selectedRows = allData.slice(0, rowNumber);
        setSelectedGallery(selectedRows);
      };

      fetchAllPages();
    }
  }, [rowNumber]);

  const fetchGalleryData = () => {
    axios
      .get(
        `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}`
      )
      .then((response) => {
        setGallery(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleRowSubmit = () => {
    if (rowNumber && rowNumber > 0) {
      if (rowNumber > rowsPerPage) {
        const selectedRows = allGallery.slice(0, rowNumber);
        setSelectedGallery(selectedRows);
      } else {
        const selectedRows = gallery.slice(0, rowNumber);
        setSelectedGallery(selectedRows);
      }
    }
    setSelected(false);
  };

  const visibleGallery = gallery.slice(0, rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 drop-shadow-lg">
        Art Gallery
      </h1>
      <div className="relative w-full max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleSelect}
              className="flex items-center space-x-1 bg-transparent px-2"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {selected && (
              <div
                className="absolute mt-2 z-20 bg-white shadow-lg rounded-lg p-4 w-64"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  className="w-full mb-3 p-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  placeholder="Select rows..."
                  value={rowNumber}
                  onChange={(e) => setRowNumber(Number(e.target.value))}
                  min={1}
                />
                <button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleRowSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          <DataTable
            value={visibleGallery}
            selectionMode={rowClick ? 'multiple' : 'checkbox'}
            selection={selectedGallery}
            onSelectionChange={(e: { value: Types[] }) =>
              setSelectedGallery(e.value)
            }
            dataKey="id"
            className="min-w-full text-sm"
            stripedRows
            rows={rowsPerPage}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="title" header="Title" className="p-4 font-medium" />
            <Column field="place_of_origin" header="Origin" className="p-4" />
            <Column field="artist_display" header="Artist" className="p-4" />
            <Column field="inscriptions" header="Inscriptions" className="hidden md:table-cell p-4" />
            <Column field="date_start" header="Start Date" className="hidden sm:table-cell p-4" />
            <Column field="date_end" header="End Date" className="hidden sm:table-cell p-4" />
          </DataTable>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
          <Button
            label="Previous"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          />
          <span className="text-base text-gray-700 font-medium">Page {currentPage}</span>
          <Button
            label="Next"
            onClick={handleNextPage}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ArtGallery;
