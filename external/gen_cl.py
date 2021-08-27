
if __name__ == "__main__":
    txt = ""
    #
    for r in range(256):
        for g in range(256):
            for b in range(256):
                txt += f"\n.rgb_{r}_{g}_{b}{{ background-color: rgb({r}, {g}, {b}); }}"
    #
    f=open("colors.css", "w")
    f.write(txt)
    f.close()
