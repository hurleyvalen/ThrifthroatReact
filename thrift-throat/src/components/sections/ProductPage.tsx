import { useNavigate, useLocation } from "react-router-dom";
import Filter from "../Filter";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import Modal from "../Modal";

interface Product {
  id: number;
  link: string;
  type: string;
  name: string;
  price: number;
  size: string;
  extraImages: string[];
  measurement: string;
  brandModel: string;
}

function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { onHold, saveItem } = useCart();
  const productsPerPage = 8; // Number of products per page
  const [currentFrom, setCurrentFrom] = useState("0");
  const [currentTo, setCurrentTo] = useState("5000");
  const [currentOrder, setCurrentOrder] = useState("ascending");
  const [currentCategory, setCurrentCategory] = useState<string[]>([]);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMeasurement, setModalMeasurement] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [modalBrandModel, setModalBrandModel] = useState("");
  const [modalSizes, setModalSizes] = useState("");
  const openModal = (
    images: string[],
    price: string,
    brandModel: string,
    measurement: string,
    sizes: string
  ) => {
    const imagesToShow = images.length > 0 && images[0] !== "" ? images : [];
    setModalImages(imagesToShow);
    setModalMeasurement(measurement);
    setModalBrandModel(brandModel);
    setModalPrice(price);
    setModalSizes(sizes);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
  };

  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);

  const products: Product[] = [
    {
      id: 1,
      link: "/images/cap1.jpg",
      type: "cap",
      name: "Ralph Lauren",
      price: 600,
      size: "MEDIUM",
      extraImages: ["/images/cap1.jpg", "/images/cap2.jpg", "/images/cap4.jpg"],
      measurement: "malaki",
      brandModel: "Lascoste",
    },
    {
      id: 2,
      link: "/images/cap2.jpg",
      type: "cap",
      name: "Vintage Disney",
      price: 400,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "malaki",
      brandModel: "Lascoste",
    },
    {
      id: 3,
      link: "/images/cap3.jpg",
      type: "cap",
      name: "Vintage Vans",
      price: 500,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "malaki",
      brandModel: "Lascoste",
    },
    {
      id: 4,
      link: "/images/cap4.jpg",
      type: "cap",
      name: "Thrasher Dad Hat",
      price: 650,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "malaki",
      brandModel: "Lascoste",
    },
    {
      id: 5,
      link: "/images/cap5.jpg",
      type: "cap",
      name: "New Era C.",
      price: 500,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "malaki",
      brandModel: "Lascoste",
    },
    {
      id: 6,
      link: "/images/jacket3.jpg",
      type: "jacket",
      name: "Nike ",
      price: 600,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "22x27.5",
      brandModel: "Lascoste",
    },
    {
      id: 7,
      link: "/images/jacket2.jpg",
      type: "jacket",
      name: "Adidas ",
      price: 550,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "21.5x27.5",
      brandModel: "Lascoste",
    },
    {
      id: 8,
      link: "/images/jack2.jpg",
      type: "jacket",
      name: "Marlboro ",
      price: 800,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "26x30",
      brandModel: "Lascoste",
    },
    {
      id: 9,
      link: "/images/jacket4.jpg",
      type: "jacket",
      name: "Champion ",
      price: 600,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "20x25.5",
      brandModel: "Lascoste",
    },
    {
      id: 10,
      link: "/images/jack1.jpg",
      type: "jacket",
      name: "Nike ",
      price: 1000,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "26x29",
      brandModel: "Lascoste",
    },
    {
      id: 11,
      link: "/images/jack3.jpg",
      type: "jacket",
      name: "Bapesta ",
      price: 600,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "25x30",
      brandModel: "Lascoste",
    },
    {
      id: 12,
      link: "/images/ll1.jpg",
      type: "shirt",
      name: "The Mountain ",
      price: 600,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "25x34",
      brandModel: "Lascoste",
    },
    {
      id: 13,
      link: "/images/long1.jpg",
      type: "shirt",
      name: "Rip n Dip",
      price: 650,
      size: "MEDIUM",
      extraImages: [""],
      measurement: "24x31",
      brandModel: "RipnDip",
    },
    {
      id: 14,
      link: "/images/ll2.jpg",
      type: "jacket",
      name: "Nike Vintage Jacket",
      price: 800,
      size: "LARGE",
      extraImages: [""],
      measurement: "25x34",
      brandModel: "NIKE",
    },
    {
      id: 15,
      link: "/images/long2.jpg",
      type: "long sleeve",
      name: "Nike Vintage Jacket",
      price: 800,
      size: "LARGE",
      extraImages: [""],
      measurement: "25x34",
      brandModel: "NIKE",
    },
  ];

  useEffect(() => {
    filterProducts(getCurrentPage());
  }, [location.search]);

  const filterProducts = (page: number) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page.toString());
    const from = parseInt(queryParams.get("from") || currentFrom);
    const to = parseInt(queryParams.get("to") || currentTo);
    const order = queryParams.get("sort") || currentOrder;
    // Get all category params (e.g., ?category=cap&category=jacket)
    const categoryParams = queryParams.getAll("category") || currentCategory;
    let tempProducts = products.filter((product) => {
      const inPriceRange = product.price >= from && product.price <= to;
      const inCategory =
        categoryParams.length === 0 || categoryParams.includes(product.type);

      return inPriceRange && inCategory;
    });
    if (order == "ascending") {
      tempProducts.sort((a, b) => a.price - b.price);
    } else {
      tempProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(tempProducts);
    setCurrentFrom(from.toString());
    setCurrentTo(to.toString());
    setCurrentOrder(order);
    setCurrentCategory(categoryParams);
    handlePageChange(queryParams);
  };

  // Get current page from URL query parameter or default to 1
  const getCurrentPage = () => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get("page") || "1", 10);
    return page;
  };

  const currentPage = getCurrentPage();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get current products based on pagination
  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const currentProducts = getCurrentProducts();

  // Handle pagination click
  const handlePageChange = (params: URLSearchParams): void => {
    // Update URL with new page number without changing component
    if (currentPage != parseInt(params.get("page") || "1", 10)) {
      window.scrollTo({ top: 120, behavior: "smooth" });
      navigate(`/products?${params}`);
    }
  };

  // Generate pagination buttons
  const renderPagination = () => {
    return (
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => filterProducts(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  const saveCartItems = (item: Product) => {
    saveItem([item]);
  };

  const isProductOnHold = (product: Product) => {
    return onHold?.some((p) => p.id === product.id) ?? false;
  };

  return (
    <>
      <section className="mainContentProductPage">
        <Filter></Filter>
        <div className="productRow">
          {/* Each product row contains info of 4 elements (on pc)*/}
          {currentProducts.map((product) => {
            const onHoldStatus = isProductOnHold(product);
            return (
              <div
                key={product.id}
                className="productInfoContainer"
                style={
                  onHoldStatus
                    ? { position: "relative", filter: "brightness(0.5)" }
                    : {}
                }
              >
                <div className="card-inner">
                  <div className="card-front">
                    <div
                      className="productImageContainer"
                      style={{ position: "relative" }}
                    >
                      <img
                        className="productImage"
                        alt="product"
                        src={product.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(
                            product.extraImages &&
                              product.extraImages.length > 0
                              ? product.extraImages
                              : [product.link],
                            product.price.toString() || "",
                            product.brandModel || "",
                            product.measurement || "",
                            product.size || ""
                          );
                        }}
                        style={onHoldStatus ? { pointerEvents: "none" } : {}}
                      />
                      {onHoldStatus && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                          }}
                        >
                          <span
                            style={{
                              color: "#fff",
                              fontSize: "3rem",
                              fontWeight: "bold",
                              background: "rgba(0,0,0,0.7)",
                              borderRadius: "50%",
                              width: "60px",
                              height: "60px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ×
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="productInfo">
                      <p className="productContent">{product.name}</p>
                      <p className="price">PHP {product.price}</p>
                    </div>
                  </div>
                </div>
                <div className="buttonContainer">
                  <button
                    className="addCart"
                    onClick={() => saveCartItems(product)}
                    disabled={onHoldStatus}
                  >
                    {onHoldStatus ? "ON HOLD" : "ADD TO CART"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {renderPagination()}
      {isModalOpen && (
        <Modal
          images={modalImages}
          price={modalPrice}
          brandModel={modalBrandModel}
          measurement={modalMeasurement}
          size={modalSizes}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default ProductPage;
