# Makefile for Cowsay-Files

PACKAGE_TARNAME = cowsay-files

prefix = /usr/local
exec_prefix = ${prefix}
bindir = ${exec_prefix}/bin
datarootdir = ${prefix}/share
datadir = ${datarootdir}
docdir = ${datarootdir}/doc/${PACKAGE_TARNAME}
sysconfdir = ${prefix}/etc
mandir=${datarootdir}/man
srcdir = .

SHELL = /bin/sh
INSTALL = install
INSTALL_PROGRAM = $(INSTALL)
INSTALL_DATA = ${INSTALL} -m 644

.PHONY: install uninstall

install: cowrc.sh
	$(INSTALL) -d $(DESTDIR)$(prefix)
	$(INSTALL) -d $(DESTDIR)$(datadir)/$(PACKAGE_TARNAME)
	$(INSTALL_DATA) cowrc.sh $(DESTDIR)$(datadir)/$(PACKAGE_TARNAME)
	cp -R cows $(DESTDIR)$(datadir)/$(PACKAGE_TARNAME)
	@# This cowpath.d stuff is for registering the collection with the new Cowsay-apj
	@# fork of Cowsay, which supports pluggable cow collections.
	@# See: https://github.com/cowsay-org/cowsay
	$(INSTALL) -d $(DESTDIR)$(sysconfdir)/cowsay/cowpath.d
	echo "$(datadir)/$(PACKAGE_TARNAME)/cows" > $(DESTDIR)$(sysconfdir)/cowsay/cowpath.d/$(PACKAGE_TARNAME).path

uninstall:
	rm -rf $(DESTDIR)$(datadir)/$(PACKAGE_TARNAME)/cowrc.sh
	rm -rf $(DESTDIR)$(datadir)/$(PACKAGE_TARNAME)/cows
	rm -f $(DESTDIR)$(sysconfdir)/cowsay/cowpath.d/$(PACKAGE_TARNAME).path
