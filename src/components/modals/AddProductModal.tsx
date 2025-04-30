"use client";

import { useAppDispatch } from "@/app/redux";
import useAddProductModal from "@/hooks/useAddProductModal";
import { AddProductsType } from "@/lib/utils";
import { SET_PREVIEW_DATA } from "@/state";
import { Download, File, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parse } from "papaparse";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FileRejection } from "react-dropzone";
import { toast } from "sonner";
import * as xlsx from "xlsx";
import { DropzoneContainer } from "../DropzoneContainer";
import { AddSingleProduct } from "../form/AddProductForm";
import { SelectButtons } from "../SelectButton";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Modal } from "./Modal";

enum STEPS {
  ADD = 0,
  UPLOAD = 1,
  PREVIEW = 2,
}

export const AddProductModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addProductModal = useAddProductModal();
  const [options, setOptions] = useState<{
    add_products: (typeof AddProductsType.options)[number];
  }>({ add_products: AddProductsType.options[0] });
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(STEPS.ADD);
  const [data, setData] = useState<Array<any>>([]);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
  }>({ name: "", size: 0 });
  const [progress, setProgress] = useState<{
    percentage: number;
    show: boolean;
  }>({
    percentage: 0,
    show: false,
  });

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, [setStep]);

  const maxSize = 10 * 1024 * 1024; // 10MB in bytes

  const handleChange = (val: (typeof AddProductsType.options)[number]) => {
    setOptions((prev) => ({
      ...prev,
      add_products: val,
    }));
  };

  const extension = uploadedFile.name.split(".")[1];
  const size = (uploadedFile.size / 1000000).toFixed(3);
  const handleDropAccepted = async (acceptedFiles: File[]) => {
    setUploadedFile({
      name: acceptedFiles[0].name,
      size: acceptedFiles[0].size,
    });

    // Iterate over the accepted files
    Array.from(acceptedFiles).forEach(async (file) => {
      try {
        let parsedData: any[] = [];
        const arrayBuffer = await file.arrayBuffer();

        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          // Convert CSV to JSON
          const text = new TextDecoder("utf-8").decode(arrayBuffer);
          parsedData = parse(text, { header: true }).data; // Use PapaParse for CSV parsing
        } else if (
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls")
        ) {
          // Handle .xlsx and .xls files
          const workbook = xlsx.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0]; // Read the first sheet
          const worksheet = workbook.Sheets[sheetName];
          parsedData = xlsx.utils.sheet_to_json(worksheet, {
            header: 1,
            blankrows: false,
          });

          if (parsedData.length > 0 && Array.isArray(parsedData[0])) {
            const [headers, ...rows] = parsedData;
            parsedData = rows.map((row) =>
              (headers as string[]).reduce((obj, key, index) => {
                obj[key] = row[index] ?? "";
                return obj;
              }, {} as Record<string, any>)
            );
          }
          // Convert parsed JSON data to plain objects
          // parsedData = JSON.parse(JSON.stringify(jsonData));
        } else {
          toast.error("Error", { description: "Unsupported file type." });
        }

        // Update the state with parsed data
        setData(parsedData);
      } catch (error) {
        toast.error("Error", {
          description:
            "Failed to process the file. Please check the file format.",
        });
        console.error("File processing error:", error);
      }
    });
  };

  const handleDropRejected = (rejectedFiles: FileRejection[]) => {
    rejectedFiles.forEach((file) => {
      file.errors.forEach((error) => {
        if (error.code === "file-invalid-type") {
          toast.error("Error", {
            description:
              "Invalid file type. Please upload a .csv or .xlsx file.",
          });
          return;
        }

        if (error.code === "file-too-large") {
          toast.error("Error", { description: "File too large" });
          return;
        }
      });
    });
  };

  const handleDelete = useCallback(() => {
    onBack();
    setProgress({ percentage: 0, show: false });
    setData([]);
  }, [onBack, setProgress, setData]);

  useEffect(() => {
    if (data.length !== 0) {
      onNext();
    }
  }, [data, onNext]);

  const downloadTemplate = async () => {
    startTransition(async () => {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL2) {
        toast.error("Configuration Error", {
          description: "Server URL not configured",
        });
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL2}/temp1.xlsx`
        );

        if (!response.ok) throw new Error("Failed to download template");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const aTag = document.createElement("a");

        aTag.href = url;
        aTag.download = "product_template.xlsx";
        document.body.appendChild(aTag);
        aTag.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        aTag.parentNode?.removeChild(aTag);
      } catch (error) {
        toast.error("Download Failed", {
          description: "Could not download template file",
        });
        addProductModal.onClose();
      }
    });
  };

  const handleUpload = useCallback(() => {
    setProgress({ percentage: 0, show: true });
    const products = data.filter((product) => product["Item Type"] !== "");
    dispatch(SET_PREVIEW_DATA(products));
    setTimeout(() => {
      setProgress({ percentage: 100, show: true });
      router.push("/inventory/preview");
      addProductModal.onClose();
      setStep(STEPS.ADD);
    }, 500);
  }, [setProgress, data, dispatch, router, addProductModal]);

  const headerContent = (
    <div className="">
      <p className="text-xl">
        {addProductModal.type === "click"
          ? "Add Product"
          : options.add_products.title}
      </p>
      <p className="text-xs md:text-sm text-[#636363]">
        {addProductModal.type === "click"
          ? "Choose an option and add products to your inventory."
          : options.add_products.subTitle}
      </p>
    </div>
  );

  let bodyContent =
    addProductModal.type === "click" ? (
      <div>
        <SelectButtons options={options} onChange={handleChange} />
        <div className="flex justify-end px-6 pb-4">
          <Button
            variant={"cauntr_blue"}
            className="cursor-pointer"
            onClick={
              options.add_products.title === "Add an Item"
                ? () =>
                    addProductModal.onOpen("single", addProductModal.suppliers)
                : () => {
                    addProductModal.onOpen("multiple", []);
                    setStep(STEPS.UPLOAD);
                  }
            }
          >
            Continue
          </Button>
        </div>
      </div>
    ) : addProductModal.type === "single" ? (
      <AddSingleProduct />
    ) : (
      <>
        <div className="m-4 bg-[#F4F5F7] rounded-lg p-4 flex justify-between md:items-center flex-col md:flex-row gap-3">
          <div className="space-y-2">
            <p className="flex gap-1 items-start text-sm">
              <FileText className="size-[14px] text-[#0C049B] mt-1" /> Template
              Checklist
            </p>

            <ul className="text-xs list-disc ml-4 text-[#636363]">
              <li>Download Template</li>
              <li>Use supported headings represented in the template</li>
              <li>You can import a maximum of 100 items</li>
            </ul>
          </div>

          <Button
            variant={"outline"}
            className="cursor-pointer text-sm"
            onClick={downloadTemplate}
            size={"sm"}
            disabled={isPending}
            loadingText="Downloading..."
            isLoading={isPending}
          >
            Download Template <Download className="size-4 ml-2" />
          </Button>
        </div>

        <div className="border-2 border-dashed border-[#EAECF0] rounded-md mx-4 mb-4 py-3 md:py-5">
          <DropzoneContainer
            acceptedType={{
              "text/csv": [],
              "application/vnd.ms-excel": [],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [],
            }}
            handleDropAccepted={handleDropAccepted}
            handleDropRejected={handleDropRejected}
            notPend=".csv, .xls, .xlxs (max 10mb)"
            maxSize={maxSize}
          />
        </div>
      </>
    );

  if (step === STEPS.PREVIEW) {
    bodyContent = (
      <>
        <div className="relative p-4 flex-auto border-b-[1px] mb-4 space-y-5">
          <div className="border-2 border-[#EAECF0] rounded-md p-4 flex gap-4 items-center">
            <div className="relative">
              <File className="h-16 w-16 text-[#D0D5DD]" strokeWidth={"0.5"} />{" "}
              <p className="text-white bg-[#079455] px-[6px] py-[2px] text-sm absolute top-7 rounded-md">
                {extension}
              </p>
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-[#344054] font-semibold text-xl">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-[#475467]">{size}MB</p>
                </div>
                <div onClick={handleDelete}>
                  <Trash2 className="cursor-pointer" />
                </div>
              </div>

              {progress.show && (
                <div className="flex flex-col items-center flex-1">
                  <Progress
                    value={progress.percentage}
                    className="mt-2 h-2 bg-gray-300 "
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 flex justify-end">
          <Button size={"sm"} onClick={handleUpload} className="cursor-pointer">
            Upload Products
          </Button>
        </div>
      </>
    );
  }

  return addProductModal.type === "click" && step === STEPS.ADD ? (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      onClose={() => {
        addProductModal.onClose();
        setData([]);
        setStep(STEPS.ADD);
      }}
      isOpen={addProductModal.isOpen}
    />
  ) : addProductModal.type === "single" && step === STEPS.ADD ? (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      onClose={() => {
        addProductModal.onClose();
        setData([]);
        setStep(STEPS.ADD);
      }}
      isOpen={addProductModal.isOpen}
      addStyle2
    />
  ) : (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      onClose={() => {
        addProductModal.onClose();
        setData([]);
        setStep(STEPS.ADD);
      }}
      isOpen={addProductModal.isOpen}
      addStyle="md:w-[600px]!"
    />
  );
};
