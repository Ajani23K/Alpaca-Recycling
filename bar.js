const input = document.getElementById("input");
const sortedcontainer = document.getElementById("sorted_container");

function classifyItem(item) {
    const plastic = [
  "bottle", "container", "plastic bag", "jug", "plastic",
  "tupperware", "clamshell", "wrapper", "packaging", "film",
  "polyethylene", "shrink wrap", "ziplock",
  "grocery bag", "saran wrap", "six-pack ring", "plastic lid"];;

    const metal = ["can", "foil", "tin", "aluminum", "metal", 
    "aerosol can", "steel", "bottle cap", "soda can", "food can",
    "metal lid", "scrap metal", "copper wire", "brass", "chrome"];

    const paper = [ "newspaper", "magazine", "cardboard", "paper", "box", "carton",
  "envelope", "flyer", "paper bag", "junk mail", "notebook",
  "post-it", "copy paper", "printer paper", "tissue box", "folder",
  "paperboard", "cereal box", "wrapping paper", "toilet paper roll"];
    
    const lowerItem = item.toLowerCase();

    if (plastic.some(p => lowerItem.includes(p))) {
        return "Plastic";
    } else if (metal.some(m => lowerItem.includes(m))) {
        return "Metal";
    } else if (paper.some(p => lowerItem.includes(p))) {
        return "Paper";
    } else {
        return "Trash";
    }
}

function addItem(){
    if(input.value.trim() === ''){
        alert("Please add an item for recycling");
    } else {
        const itemName = input.value.trim();
        const category = classifyItem(itemName);
        
        let li = document.createElement("li");
        li.innerHTML = `${itemName} <em class="category-label">(${category})</em>`;
        sortedcontainer.appendChild(li);
        
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }

    input.value = "";
}

sortedcontainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
    }
}, false);
